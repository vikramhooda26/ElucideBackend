/*
  Warnings:

  - You are about to drop the column `association_id` on the `dashapp_brand_association` table. All the data in the column will be lost.
  - You are about to drop the `association` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `association_level` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "association" DROP CONSTRAINT "association_association_level_id_fkey";

-- DropForeignKey
ALTER TABLE "association" DROP CONSTRAINT "association_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "association" DROP CONSTRAINT "association_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "association" DROP CONSTRAINT "association_leagueInfo_id_fkey";

-- DropForeignKey
ALTER TABLE "association" DROP CONSTRAINT "association_modified_by_id_fkey";

-- DropForeignKey
ALTER TABLE "association" DROP CONSTRAINT "association_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_brand_association" DROP CONSTRAINT "dashapp_brand_association_association_id_fkey";

-- DropIndex
DROP INDEX "dashapp_brand_association_association_id_idx";

-- AlterTable
ALTER TABLE "dashapp_brand_association" DROP COLUMN "association_id",
ADD COLUMN     "dashapp_team_association_id" BIGINT;

-- DropTable
DROP TABLE "association";

-- CreateTable
CREATE TABLE "dashapp_team_association" (
    "id" BIGSERIAL NOT NULL,
    "cost" DECIMAL,
    "association_level_id" BIGINT,
    "created_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,
    "team_id" BIGINT,

    CONSTRAINT "dashapp_team_association_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_association" (
    "id" BIGSERIAL NOT NULL,
    "cost" DECIMAL,
    "association_level_id" BIGINT,
    "created_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,
    "leagueInfo_id" BIGINT,

    CONSTRAINT "dashapp_leagueinfo_association_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_athlete_association" (
    "id" BIGSERIAL NOT NULL,
    "cost" DECIMAL,
    "association_level_id" BIGINT,
    "created_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,
    "athlete_id" BIGINT,

    CONSTRAINT "dashapp_athlete_association_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_association_association_level_id_key" ON "dashapp_team_association"("association_level_id");

-- CreateIndex
CREATE INDEX "dashapp_team_association_association_level_id_idx" ON "dashapp_team_association"("association_level_id");

-- CreateIndex
CREATE INDEX "dashapp_team_association_team_id_idx" ON "dashapp_team_association"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_association_association_level_id_key" ON "dashapp_leagueinfo_association"("association_level_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_association_association_level_id_idx" ON "dashapp_leagueinfo_association"("association_level_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_association_leagueInfo_id_idx" ON "dashapp_leagueinfo_association"("leagueInfo_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_athlete_association_association_level_id_key" ON "dashapp_athlete_association"("association_level_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_association_association_level_id_idx" ON "dashapp_athlete_association"("association_level_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_association_athlete_id_idx" ON "dashapp_athlete_association"("athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "association_level_name_key" ON "association_level"("name");

-- CreateIndex
CREATE INDEX "dashapp_brand_association_dashapp_team_association_id_idx" ON "dashapp_brand_association"("dashapp_team_association_id");

-- AddForeignKey
ALTER TABLE "dashapp_team_association" ADD CONSTRAINT "dashapp_team_association_association_level_id_fkey" FOREIGN KEY ("association_level_id") REFERENCES "association_level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_team_association" ADD CONSTRAINT "dashapp_team_association_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_association" ADD CONSTRAINT "dashapp_team_association_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_association" ADD CONSTRAINT "dashapp_team_association_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_association" ADD CONSTRAINT "dashapp_leagueinfo_association_association_level_id_fkey" FOREIGN KEY ("association_level_id") REFERENCES "association_level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_association" ADD CONSTRAINT "dashapp_leagueinfo_association_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_association" ADD CONSTRAINT "dashapp_leagueinfo_association_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_association" ADD CONSTRAINT "dashapp_leagueinfo_association_leagueInfo_id_fkey" FOREIGN KEY ("leagueInfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_association" ADD CONSTRAINT "dashapp_athlete_association_association_level_id_fkey" FOREIGN KEY ("association_level_id") REFERENCES "association_level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_association" ADD CONSTRAINT "dashapp_athlete_association_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_association" ADD CONSTRAINT "dashapp_athlete_association_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_association" ADD CONSTRAINT "dashapp_athlete_association_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_brand_association" ADD CONSTRAINT "dashapp_brand_association_dashapp_team_association_id_fkey" FOREIGN KEY ("dashapp_team_association_id") REFERENCES "dashapp_team_association"("id") ON DELETE CASCADE ON UPDATE CASCADE;
