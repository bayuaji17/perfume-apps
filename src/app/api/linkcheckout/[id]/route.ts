import { ProtectApi } from "@/lib/auth-protect";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ProtectApi(req);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const deletedLink = await prisma.checkoutLink.delete({
      where: { id },
    });
    return NextResponse.json(
      {
        success: true,
        data: deletedLink,
        message: `link platform ${deletedLink.platform} has been successfully deleted`,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            success: false,
            error: "Link not found",
          },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while deleting link",
      },
      { status: 500 }
    );
  }
}
