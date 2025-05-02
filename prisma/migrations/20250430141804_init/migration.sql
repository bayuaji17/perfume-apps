-- CreateEnum
CREATE TYPE "ConcentrationType" AS ENUM ('edp', 'edt', 'edc');

-- CreateEnum
CREATE TYPE "GenderCategory" AS ENUM ('female', 'male', 'unisex');

-- CreateEnum
CREATE TYPE "NoteRole" AS ENUM ('top', 'middle', 'base');

-- CreateEnum
CREATE TYPE "COType" AS ENUM ('lazada', 'shopee', 'tokopedia', 'whatsapp');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'archive');

-- CreateTable
CREATE TABLE "Perfume" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "concentration" "ConcentrationType" NOT NULL,
    "sizeML" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "brandId" TEXT NOT NULL,
    "gender" "GenderCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Perfume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfumeImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "perfumeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PerfumeImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfumeNote" (
    "id" TEXT NOT NULL,
    "perfumeId" TEXT NOT NULL,
    "role" "NoteRole" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PerfumeNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckoutLink" (
    "id" TEXT NOT NULL,
    "perfumeId" TEXT NOT NULL,
    "type" "COType" NOT NULL,
    "link" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckoutLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Perfume_gender_idx" ON "Perfume"("gender");

-- CreateIndex
CREATE INDEX "Perfume_brandId_idx" ON "Perfume"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "Perfume_name_brandId_key" ON "Perfume"("name", "brandId");

-- CreateIndex
CREATE INDEX "PerfumeImage_perfumeId_idx" ON "PerfumeImage"("perfumeId");

-- CreateIndex
CREATE UNIQUE INDEX "PerfumeImage_perfumeId_displayOrder_key" ON "PerfumeImage"("perfumeId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PerfumeNote_perfumeId_role_key" ON "PerfumeNote"("perfumeId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE INDEX "CheckoutLink_perfumeId_idx" ON "CheckoutLink"("perfumeId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutLink_perfumeId_type_key" ON "CheckoutLink"("perfumeId", "type");

-- AddForeignKey
ALTER TABLE "Perfume" ADD CONSTRAINT "Perfume_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfumeImage" ADD CONSTRAINT "PerfumeImage_perfumeId_fkey" FOREIGN KEY ("perfumeId") REFERENCES "Perfume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfumeNote" ADD CONSTRAINT "PerfumeNote_perfumeId_fkey" FOREIGN KEY ("perfumeId") REFERENCES "Perfume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutLink" ADD CONSTRAINT "CheckoutLink_perfumeId_fkey" FOREIGN KEY ("perfumeId") REFERENCES "Perfume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
