/*
  Warnings:

  - You are about to drop the column `brand_id` on the `association` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "association" DROP CONSTRAINT "association_brand_id_fkey";

-- DropIndex
DROP INDEX "association_athlete_id_cost_idx";

-- DropIndex
DROP INDEX "association_athlete_id_key";

-- DropIndex
DROP INDEX "association_brand_id_key";

-- DropIndex
DROP INDEX "association_leagueInfo_id_key";

-- DropIndex
DROP INDEX "association_team_id_key";

-- AlterTable
ALTER TABLE "association" DROP COLUMN "brand_id";

-- AlterTable
ALTER TABLE "dashapp_companydata" ADD COLUMN     "associationId" BIGINT;

-- CreateTable
CREATE TABLE "dashapp_brand_association" (
    "id" BIGSERIAL NOT NULL,
    "brand_id" BIGINT,
    "association_id" BIGINT,

    CONSTRAINT "dashapp_brand_association_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dashapp_brand_association_brand_id_idx" ON "dashapp_brand_association"("brand_id");

-- CreateIndex
CREATE INDEX "dashapp_brand_association_association_id_idx" ON "dashapp_brand_association"("association_id");

-- CreateIndex
CREATE INDEX "athlete_id_index" ON "association"("athlete_id");

-- AddForeignKey
ALTER TABLE "dashapp_brand_association" ADD CONSTRAINT "dashapp_brand_association_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_brand_association" ADD CONSTRAINT "dashapp_brand_association_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "association"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "association_association_level_id_idx" RENAME TO "association_level_id_index";

-- RenameIndex
ALTER INDEX "association_team_id_idx" RENAME TO "team_id_index";
