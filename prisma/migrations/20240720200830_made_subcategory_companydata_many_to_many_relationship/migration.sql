/*
  Warnings:

  - You are about to drop the column `subcategory_id` on the `dashapp_companydata` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "dashapp_companydata" DROP CONSTRAINT "dashapp_companydata_subcategory_id_fkey";

-- DropIndex
DROP INDEX "dashapp_companydata_category_id_84d9e9fb";

-- AlterTable
ALTER TABLE "dashapp_companydata" DROP COLUMN "subcategory_id";

-- CreateTable
CREATE TABLE "dashapp_companydata_subcategory" (
    "id" BIGSERIAL NOT NULL,
    "companydata_id" BIGINT,
    "subcategory_id" BIGINT,

    CONSTRAINT "dashapp_companydata_subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dashapp_companydata_subcategory_companydata_id_idx" ON "dashapp_companydata_subcategory"("companydata_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_subcategory_subcategory_id_idx" ON "dashapp_companydata_subcategory"("subcategory_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_companydata_subcategory_companydata_id_subcategory__key" ON "dashapp_companydata_subcategory"("companydata_id", "subcategory_id");

-- AddForeignKey
ALTER TABLE "dashapp_companydata_subcategory" ADD CONSTRAINT "dashapp_companydata_subcategory_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_subcategory" ADD CONSTRAINT "dashapp_companydata_subcategory_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "dashapp_subcategory"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
