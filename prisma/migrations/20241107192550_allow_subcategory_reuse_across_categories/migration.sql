/*
  Warnings:

  - A unique constraint covering the columns `[category_id,subcategory]` on the table `dashapp_subcategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "dashapp_subcategory_subcategory_key";

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_subcategory_category_id_subcategory_key" ON "dashapp_subcategory"("category_id", "subcategory");
