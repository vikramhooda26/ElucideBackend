/*
  Warnings:

  - You are about to drop the column `category_id` on the `dashapp_companydata` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "dashapp_companydata" DROP CONSTRAINT "dashapp_companydata_category_id_fkey";

-- DropIndex
DROP INDEX "dashapp_companydata_category_id_84d9e9fb";

-- AlterTable
ALTER TABLE "dashapp_companydata" DROP COLUMN "category_id",
ADD COLUMN     "subcategory_id" BIGINT;

-- CreateIndex
CREATE INDEX "dashapp_companydata_category_id_84d9e9fb" ON "dashapp_companydata"("subcategory_id");

-- AddForeignKey
ALTER TABLE "dashapp_companydata" ADD CONSTRAINT "dashapp_companydata_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "dashapp_subcategory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
