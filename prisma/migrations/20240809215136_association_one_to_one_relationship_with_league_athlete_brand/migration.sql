/*
  Warnings:

  - A unique constraint covering the columns `[team_id]` on the table `association` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[leagueInfo_id]` on the table `association` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[athlete_id]` on the table `association` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[brand_id]` on the table `association` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "association" DROP CONSTRAINT "association_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "association" DROP CONSTRAINT "association_leagueInfo_id_fkey";

-- DropForeignKey
ALTER TABLE "association" DROP CONSTRAINT "association_team_id_fkey";

-- AlterTable
ALTER TABLE "association" ADD COLUMN     "brand_id" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "association_team_id_key" ON "association"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "association_leagueInfo_id_key" ON "association"("leagueInfo_id");

-- CreateIndex
CREATE UNIQUE INDEX "association_athlete_id_key" ON "association"("athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "association_brand_id_key" ON "association"("brand_id");

-- AddForeignKey
ALTER TABLE "association" ADD CONSTRAINT "association_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "association" ADD CONSTRAINT "association_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "association" ADD CONSTRAINT "association_leagueInfo_id_fkey" FOREIGN KEY ("leagueInfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "association" ADD CONSTRAINT "association_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
