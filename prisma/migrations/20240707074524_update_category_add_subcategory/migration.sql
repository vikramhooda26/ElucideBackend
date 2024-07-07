/*
  Warnings:

  - You are about to drop the column `created_by` on the `dashapp_category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `dashapp_category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category]` on the table `dashapp_category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `dashapp_category` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_date` on table `dashapp_category` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "dashapp_category" DROP CONSTRAINT "dashapp_category_modified_by_id_fkey";

-- DropIndex
DROP INDEX "sqlite_autoindex_dashapp_category_1";

-- AlterTable
ALTER TABLE "dashapp_category" DROP COLUMN "created_by",
DROP COLUMN "name",
ADD COLUMN     "category" VARCHAR(512) NOT NULL,
ADD COLUMN     "created_by_id" BIGINT,
ALTER COLUMN "created_date" SET NOT NULL;

-- CreateTable
CREATE TABLE "dashapp_subcategory" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3),
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,
    "subcategory" TEXT NOT NULL,

    CONSTRAINT "dashapp_subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_subcategory_subcategory_key" ON "dashapp_subcategory"("subcategory");

-- CreateIndex
CREATE INDEX "dashapp_subcategory_created_by_id_modified_by_id_idx" ON "dashapp_subcategory"("created_by_id", "modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_category_1" ON "dashapp_category"("category");

-- AddForeignKey
ALTER TABLE "dashapp_category" ADD CONSTRAINT "dashapp_category_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_category" ADD CONSTRAINT "dashapp_category_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_subcategory" ADD CONSTRAINT "dashapp_subcategory_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_subcategory" ADD CONSTRAINT "dashapp_subcategory_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
