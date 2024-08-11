/*
  Warnings:

  - You are about to drop the `dashapp_reach_league` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dashapp_reach_team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dashapp_viewership_league` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dashapp_viewership_team` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dashapp_reach_league" DROP CONSTRAINT "dashapp_reach_league_league_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_reach_league" DROP CONSTRAINT "dashapp_reach_league_reach_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_reach_team" DROP CONSTRAINT "dashapp_reach_team_reach_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_reach_team" DROP CONSTRAINT "dashapp_reach_team_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_viewership_league" DROP CONSTRAINT "dashapp_viewership_league_league_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_viewership_league" DROP CONSTRAINT "dashapp_viewership_league_viewership_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_viewership_team" DROP CONSTRAINT "dashapp_viewership_team_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_viewership_team" DROP CONSTRAINT "dashapp_viewership_team_viewership_id_fkey";

-- AlterTable
ALTER TABLE "dashapp_reach" ADD COLUMN     "leagueinfo_id" BIGINT,
ADD COLUMN     "team_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_viewership" ADD COLUMN     "leagueinfo_id" BIGINT,
ADD COLUMN     "team_id" BIGINT;

-- DropTable
DROP TABLE "dashapp_reach_league";

-- DropTable
DROP TABLE "dashapp_reach_team";

-- DropTable
DROP TABLE "dashapp_viewership_league";

-- DropTable
DROP TABLE "dashapp_viewership_team";

-- AddForeignKey
ALTER TABLE "dashapp_reach" ADD CONSTRAINT "dashapp_reach_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_reach" ADD CONSTRAINT "dashapp_reach_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_viewership" ADD CONSTRAINT "dashapp_viewership_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_viewership" ADD CONSTRAINT "dashapp_viewership_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
