import { ProtectApi } from "@/lib/auth-protect";
import { prisma } from "@/lib/prisma";
import {
  COLinkSchemeEditDetails,
  COPerfumeScheme,
} from "@/lib/zod-scheme/perfume-scheme";
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
        platform: { in: links.map((link) => link.platform) },
      },
    });

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate entry",
          details: {
            platform: existing.map(
              (e) => `${e.platform} link already exists for this perfume,`
            ),
          },
        },
        { status: 409 }
      );
    }

    const COPerfume = await prisma.checkoutLink.createMany({
      data: links.map((link) => ({
        perfumeId,
        platform: link.platform,
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
    const validationResult = COLinkSchemeEditDetails.safeParse(body);

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
    await prisma.checkoutLink.update({
      where: {
        perfumeId: validationResult.data.perfumeId,
        id: validationResult.data.id,
      },
      data: {
        link: validationResult.data.link,
        status: validationResult.data.status,
      },
    });
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
    const { perfumeId, id } = body;

    const deleted = await prisma.checkoutLink.delete({
      where: {
        perfumeId: perfumeId,
        id: id,
      },
    });

    return NextResponse.json({
      success: true,
      data: deleted,
      message: "Checkout link deleted successfully",
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
