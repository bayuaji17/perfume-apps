import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { del, put } from "@vercel/blob";
import { perfumeScheme } from "@/lib/zod-scheme/perfume-scheme";
import { imageFileScheme } from "@/lib/zod-scheme/image-scheme";
import { auth } from "@/auth";
// Get All Perfumes
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const currentPage = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.max(1, Number(searchParams.get("limit") || 5));
  const search = searchParams.get("search") || "";
  try {
    const whereClause = search
      ? {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {};
    const [perfume, total] = await prisma.$transaction([
      prisma.perfume.findMany({
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        where: whereClause,
        orderBy: {
          name: "asc",
        },
        include: {
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
              perfumeId: true,
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
        },
      }),
      prisma.perfume.count({ where: whereClause }),
    ]);
    return NextResponse.json({
      success: true,
      data: perfume,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: Math.ceil(total / pageSize),
      total: total,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: "Database error occurred",
          message: "An unexpected error occurred",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "failed to fetch brands",
      },
      { status: 500 }
    );
  }
}

// Create Perfume
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uploadedImages: { imageUrl: string; displayOrder: number }[] = [];

  try {
    const formData = await req.formData();

    // Ambil dan validasi file gambar
    const files = formData.getAll("images") as File[];
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

    // Ambil dan ubah data mentah
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

    // Validasi data non-file
    const parsed = perfumeScheme.safeParse({
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

    const existing = await prisma.perfume.findFirst({
      where: { name: data.name, brandId: data.brandId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Perfume with this name already exists for this brand." },
        { status: 409 }
      );
    }

    // Upload gambar ke blob storage
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

    // Simpan data parfum
    const perfume = await prisma.$transaction(async (tx) => {
      return await tx.perfume.create({
        data: {
          name: data.name,
          description: data.description,
          concentration: data.concentration,
          sizeML: data.sizeML,
          price: data.price.toString(),
          brandId: data.brandId,
          gender: data.gender,
          images: {
            createMany: { data: uploadedImages },
          },
          notes: {
            createMany: { data: data.notes },
          },
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
        data: perfume,
        message: "Perfume has been successfully created",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[PERFUME_CREATE_ERROR]", error);

    // Rollback blob jika sudah ada yang ter-upload
    if (uploadedImages.length > 0) {
      await Promise.allSettled(uploadedImages.map((img) => del(img.imageUrl)));
    }

    // Error Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }

    // Error Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Perfume with this name already exists for this brand." },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid brand reference" },
          { status: 400 }
        );
      }
    }

    // Error upload
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("upload image failed")
    ) {
      return NextResponse.json(
        { error: "Image upload failed", details: error.message },
        { status: 500 }
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
