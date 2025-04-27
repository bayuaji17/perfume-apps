import { ProtectApi } from "@/lib/auth-protect";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const brandScheme = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ProtectApi(req);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const body = await req.json();
    const validationResult = brandScheme.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "validation failed",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }
    const existingBrand = await prisma.brand.findFirst({
      where: {
        name: {
          equals: validationResult.data.name,
          mode: "insensitive",
        },
        NOT: { id },
      },
    });
    if (existingBrand) {
      return NextResponse.json(
        {
          success: true,
          error: `Brand ${validationResult.data.name} already exist`,
        },
        { status: 409 }
      );
    }
    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: { name: validationResult.data.name },
    });
    return NextResponse.json(
      {
        success: true,
        data: updatedBrand,
        message: `${updatedBrand} has been successfully updated`,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            success: false,
            error: "Brand not found",
          },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while updating the brand",
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
    const deletedBrand = await prisma.brand.delete({
      where: { id },
    });
    return NextResponse.json(
      {
        success: true,
        data: deletedBrand,
        message: `${deletedBrand.name} has been successfully deleted`,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            success: false,
            error: "Brand not found",
          },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while updating the brand",
      },
      { status: 500 }
    );
  }
}
