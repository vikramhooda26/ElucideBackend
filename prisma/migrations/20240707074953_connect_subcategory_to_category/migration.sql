/*
  Warnings:

  - Added the required column `category_id` to the `dashapp_subcategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dashapp_subcategory" ADD COLUMN     "category_id" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "dashapp_subcategory" ADD CONSTRAINT "dashapp_subcategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "dashapp_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
