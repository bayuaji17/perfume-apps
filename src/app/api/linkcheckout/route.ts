import { ProtectApi } from "@/lib/auth-protect";
import { prisma } from "@/lib/prisma";
import { COPerfumeScheme } from "@/lib/zod-scheme/perfume-scheme";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const unauthorized = await ProtectApi(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const validationResult = COPerfumeScheme.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }
    const { perfumeId, links } = validationResult.data;

    const existing = await prisma.checkoutLink.findMany({
      where: {
        perfumeId,
        type: { in: links.map((link) => link.type) },
      },
    });

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate entry",
          details: {
            type: existing.map(
              (e) => `${e.type} link already exists for this perfume,`
            ),
          },
        },
        { status: 409 }
      );
    }

    const COPerfume = await prisma.checkoutLink.createMany({
      data: links.map((link) => ({
        perfumeId,
        type: link.type,
        link: link.link,
      })),
    });
    return NextResponse.json(
      {
        success: true,
        data: COPerfume,
        message: "Checkout links perfume has been successfuly created",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const unauthorized = await ProtectApi(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const validationResult = COPerfumeScheme.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { perfumeId, links } = validationResult.data;

    for (const link of links) {
      // Cek apakah data sudah ada
      const existing = await prisma.checkoutLink.findFirst({
        where: {
          perfumeId,
          type: link.type,
        },
      });

      if (existing) {
        // Update jika sudah ada
        await prisma.checkoutLink.update({
          where: { id: existing.id },
          data: {
            link: link.link,
            status: link.status ?? "active",
          },
        });
      } else {
        // Tambah baru jika belum ada
        await prisma.checkoutLink.create({
          data: {
            perfumeId,
            type: link.type,
            link: link.link,
            status: link.status ?? "active",
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Checkout links updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const unauthorized = await ProtectApi(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const { perfumeId, types } = body;

    if (!perfumeId || !Array.isArray(types) || types.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: {
            perfumeId: perfumeId ? undefined : ["Perfume ID is required"],
            types: types.length === 0 ? ["At least one type must be provided"] : undefined,
          },
        },
        { status: 400 }
      );
    }

    const deleted = await prisma.checkoutLink.deleteMany({
      where: {
        perfumeId,
        type: { in: types },
      },
    });

    return NextResponse.json({
      success: true,
      data: deleted,
      message: "Checkout link(s) deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
