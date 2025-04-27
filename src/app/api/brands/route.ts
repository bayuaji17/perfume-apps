import { ProtectApi } from "@/lib/auth-protect";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const brandScheme = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("limit") || "5");
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

    const [brand, totalCount] = await prisma.$transaction([
      prisma.brand.findMany({
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        where: whereClause,
        orderBy: {
          name: "asc",
        },
      }),
      prisma.brand.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: brand,
        total: totalCount,
        currentPage,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
      { status: 200 }
    );
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

export async function POST(req: NextRequest) {
  const unauthorized = await ProtectApi(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();

    const validationResult = brandScheme.safeParse(body);
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

    const existingBrand = await prisma.brand.findFirst({
      where: {
        name: { equals: validationResult.data.name, mode: "insensitive" },
      },
    });

    if (existingBrand) {
      return NextResponse.json(
        {
          success: false,
          error: `Brand ${validationResult.data.name} already exists`,
        },
        { status: 409 }
      );
    }

    const brand = await prisma.brand.create({
      data: validationResult.data,
    });

    return NextResponse.json(
      {
        success: true,
        data: brand,
        message: "Brand has been successfully created",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Brand creation error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            error: "Brand name already exists. Please choose a unique name",
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing your request",
      },
      { status: 500 }
    );
  }
}
