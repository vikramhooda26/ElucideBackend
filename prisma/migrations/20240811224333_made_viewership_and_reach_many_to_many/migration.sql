/*
  Warnings:

  - You are about to drop the column `leagueinfo_id` on the `dashapp_reach` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `dashapp_reach` table. All the data in the column will be lost.
  - You are about to drop the column `leagueinfo_id` on the `dashapp_viewership` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `dashapp_viewership` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "dashapp_reach" DROP CONSTRAINT "dashapp_reach_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_reach" DROP CONSTRAINT "dashapp_reach_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_viewership" DROP CONSTRAINT "dashapp_viewership_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_viewership" DROP CONSTRAINT "dashapp_viewership_team_id_fkey";

-- AlterTable
ALTER TABLE "dashapp_reach" DROP COLUMN "leagueinfo_id",
DROP COLUMN "team_id";

-- AlterTable
ALTER TABLE "dashapp_viewership" DROP COLUMN "leagueinfo_id",
DROP COLUMN "team_id";

-- CreateTable
CREATE TABLE "dashapp_reach_team" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT,
    "reach_id" BIGINT,

    CONSTRAINT "dashapp_reach_team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_reach_league" (
    "id" BIGSERIAL NOT NULL,
    "league_id" BIGINT,
    "reach_id" BIGINT,

    CONSTRAINT "dashapp_reach_league_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_viewership_team" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT,
    "viewership_id" BIGINT,

    CONSTRAINT "dashapp_viewership_team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_viewership_league" (
    "id" BIGSERIAL NOT NULL,
    "league_id" BIGINT,
    "viewership_id" BIGINT,

    CONSTRAINT "dashapp_viewership_league_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dashapp_reach_team_team_id_idx" ON "dashapp_reach_team"("team_id");

-- CreateIndex
CREATE INDEX "dashapp_reach_team_reach_id_idx" ON "dashapp_reach_team"("reach_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_reach_team_team_id_reach_id_key" ON "dashapp_reach_team"("team_id", "reach_id");

-- CreateIndex
CREATE INDEX "dashapp_reach_league_league_id_idx" ON "dashapp_reach_league"("league_id");

-- CreateIndex
CREATE INDEX "dashapp_reach_league_reach_id_idx" ON "dashapp_reach_league"("reach_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_reach_league_league_id_reach_id_key" ON "dashapp_reach_league"("league_id", "reach_id");

-- CreateIndex
CREATE INDEX "dashapp_viewership_team_team_id_idx" ON "dashapp_viewership_team"("team_id");

-- CreateIndex
CREATE INDEX "dashapp_viewership_team_viewership_id_idx" ON "dashapp_viewership_team"("viewership_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_viewership_team_team_id_viewership_id_key" ON "dashapp_viewership_team"("team_id", "viewership_id");

-- CreateIndex
CREATE INDEX "dashapp_viewership_league_league_id_idx" ON "dashapp_viewership_league"("league_id");

-- CreateIndex
CREATE INDEX "dashapp_viewership_league_viewership_id_idx" ON "dashapp_viewership_league"("viewership_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_viewership_league_league_id_viewership_id_key" ON "dashapp_viewership_league"("league_id", "viewership_id");

-- AddForeignKey
ALTER TABLE "dashapp_reach_team" ADD CONSTRAINT "dashapp_reach_team_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_reach_team" ADD CONSTRAINT "dashapp_reach_team_reach_id_fkey" FOREIGN KEY ("reach_id") REFERENCES "dashapp_reach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_reach_league" ADD CONSTRAINT "dashapp_reach_league_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_reach_league" ADD CONSTRAINT "dashapp_reach_league_reach_id_fkey" FOREIGN KEY ("reach_id") REFERENCES "dashapp_reach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_viewership_team" ADD CONSTRAINT "dashapp_viewership_team_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_viewership_team" ADD CONSTRAINT "dashapp_viewership_team_viewership_id_fkey" FOREIGN KEY ("viewership_id") REFERENCES "dashapp_viewership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_viewership_league" ADD CONSTRAINT "dashapp_viewership_league_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_viewership_league" ADD CONSTRAINT "dashapp_viewership_league_viewership_id_fkey" FOREIGN KEY ("viewership_id") REFERENCES "dashapp_viewership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
