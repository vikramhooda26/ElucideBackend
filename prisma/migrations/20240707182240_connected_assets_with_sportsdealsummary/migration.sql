/*
  Warnings:

  - You are about to drop the column `created_by` on the `dashapp_assets` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `dashapp_assets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[asset]` on the table `dashapp_assets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `asset` to the `dashapp_assets` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_date` on table `dashapp_assets` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "dashapp_assets" DROP CONSTRAINT "dashapp_assets_modified_by_id_fkey";

-- DropIndex
DROP INDEX "sqlite_autoindex_dashapp_assets_1";

-- AlterTable
ALTER TABLE "dashapp_assets" DROP COLUMN "created_by",
DROP COLUMN "name",
ADD COLUMN     "asset" VARCHAR(512) NOT NULL,
ADD COLUMN     "created_by_id" BIGINT,
ALTER COLUMN "created_date" SET NOT NULL;

-- CreateTable
CREATE TABLE "dashapp_sportsdeal_assets" (
    "sportsdeal_id" BIGINT NOT NULL,
    "asset_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_sportsdeal_assets_pkey" PRIMARY KEY ("sportsdeal_id","asset_id")
);

-- CreateIndex
CREATE INDEX "dashapp_sportsdeal_assets_asset_id_idx" ON "dashapp_sportsdeal_assets"("asset_id");

-- CreateIndex
CREATE INDEX "dashapp_sportsdeal_assets_sportsdeal_id_idx" ON "dashapp_sportsdeal_assets"("sportsdeal_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_assets_1" ON "dashapp_assets"("asset");

-- AddForeignKey
ALTER TABLE "dashapp_sportsdeal_assets" ADD CONSTRAINT "dashapp_sportsdeal_assets_sportsdeal_id_fkey" FOREIGN KEY ("sportsdeal_id") REFERENCES "dashapp_sportsdealsummary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_sportsdeal_assets" ADD CONSTRAINT "dashapp_sportsdeal_assets_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "dashapp_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_assets" ADD CONSTRAINT "dashapp_assets_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_assets" ADD CONSTRAINT "dashapp_assets_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
