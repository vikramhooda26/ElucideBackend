/*
  Warnings:

  - You are about to drop the column `brand_id` on the `association` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "association" DROP CONSTRAINT "association_brand_id_fkey";

-- DropIndex
DROP INDEX "association_brand_id_idx";

-- AlterTable
ALTER TABLE "association" DROP COLUMN "brand_id";
