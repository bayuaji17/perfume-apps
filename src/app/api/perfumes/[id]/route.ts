import { ProtectApi } from "@/lib/auth-protect";
import { prisma } from "@/lib/prisma";
import { imageFileScheme } from "@/lib/zod-scheme/image-scheme";
import { perfumeScheme } from "@/lib/zod-scheme/perfume-scheme";
import { Prisma } from "@prisma/client";
import { del, put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const perfumeId = id;

    const perfume = await prisma.perfume.findUnique({
      where: { id: perfumeId },
      select: {
        id: true,
        name: true,
        description: true,
        concentration: true,
        sizeML: true,
        price: true,
        brandId: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            imageUrl: true,
            displayOrder: true,
          },
        },
        notes: {
          select: {
            id: true,
            perfumeId: true,
            role: true,
            description: true,
          },
        },
        checkoutLinks:{
          select:{
            perfumeId:true,
            id:true,
            platform:true,
            link:true,
            status:true,
          }
        }
      },
    });

    if (!perfume) {
      return NextResponse.json({ error: "Perfume not found" }, { status: 404 });
    }

    return NextResponse.json(perfume);
  } catch (error) {
    console.error("Error fetching perfume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ProtectApi(req);
  if (unauthorized) return unauthorized;
  const uploadedImages: { imageUrl: string; displayOrder: number }[] = [];
  const { id } = await params;

  try {
    const formData = await req.formData();

    const files = formData.getAll("images") as File[];
    const hasFiles = files.length > 0;

    if (hasFiles) {
      const imageValidation = z.array(imageFileScheme).safeParse(files);
      if (!imageValidation.success) {
        return NextResponse.json(
          {
            error: "Image validation failed",
            details: imageValidation.error.flatten(),
          },
          { status: 400 }
        );
      }
    }

    const rawData = {
      name: formData.get("name"),
      description: formData.get("description"),
      concentration: formData.get("concentration"),
      sizeML: formData.get("sizeML"),
      price: formData.get("price"),
      brandId: formData.get("brandId"),
      gender: formData.get("gender"),
      notes: formData.get("notes"),
    };

    // Hanya validasi field yang ada
    const partialSchema = perfumeScheme.partial(); // semua field opsional
    const parsed = partialSchema.safeParse({
      ...rawData,
      sizeML: rawData.sizeML
        ? parseInt(rawData.sizeML as string, 10)
        : undefined,
      price: rawData.price ? parseFloat(rawData.price as string) : undefined,
      notes: rawData.notes ? JSON.parse(rawData.notes as string) : undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { data } = parsed;

    // Upload gambar jika ada
    if (hasFiles) {
      const results = await Promise.all(
        files.map(async (file, index) => {
          try {
            const uniqueFilename = `${Date.now()}-${file.name}`;
            const blob = await put(`perfume/${uniqueFilename}`, file, {
              access: "public",
            });

            return {
              imageUrl: blob.url,
              displayOrder: index,
            };
          } catch (error) {
            console.error(`Upload error on ${file.name}`, error);
            throw new Error(`upload image failed: ${file.name}`);
          }
        })
      );
      uploadedImages.push(...results);
    }

    // Pastikan parfum-nya ada
    const existingPerfume = await prisma.perfume.findUnique({ where: { id } });
    if (!existingPerfume) {
      return NextResponse.json({ error: "Perfume not found" }, { status: 404 });
    }

    const updatedPerfume = await prisma.$transaction(async (tx) => {
      if (hasFiles) {
        const oldImages = await tx.perfumeImage.findMany({
          where: { perfumeId: id },
        });
        await tx.perfumeImage.deleteMany({ where: { perfumeId: id } });
        await Promise.allSettled(oldImages.map((img) => del(img.imageUrl)));
      }

      if (data.notes) {
        await tx.perfumeNote.deleteMany({ where: { perfumeId: id } });
      }

      return await tx.perfume.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description && { description: data.description }),
          ...(data.concentration && { concentration: data.concentration }),
          ...(data.sizeML !== undefined && { sizeML: data.sizeML }),
          ...(data.price !== undefined && { price: data.price.toString() }),
          ...(data.brandId && { brandId: data.brandId }),
          ...(data.gender && { gender: data.gender }),
          ...(data.notes && {
            notes: { createMany: { data: data.notes } },
          }),
          ...(hasFiles && {
            images: { createMany: { data: uploadedImages } },
          }),
          ...(data.price && {
            price: data.price.toString(),
          }),
        },
        include: {
          images: true,
          notes: true,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        data: `${updatedPerfume.name}`,
        message: "Perfume has been successfully updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PERFUME_PATCH_ERROR]", error);

    if (uploadedImages.length > 0) {
      await Promise.allSettled(uploadedImages.map((img) => del(img.imageUrl)));
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ProtectApi(req);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const deletedPerfume = await prisma.perfume.delete({
      where: { id },
    });
    return NextResponse.json(
      {
        success: true,
        data: deletedPerfume,
        message: `${deletedPerfume.name} has been successfully deleted`,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            success: false,
            error: "Perfume not found",
          },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while Deleting Perfume",
      },
      { status: 500 }
    );
  }
}
