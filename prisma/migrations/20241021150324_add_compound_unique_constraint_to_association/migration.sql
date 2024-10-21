/*
  Warnings:

  - A unique constraint covering the columns `[athlete_id,association_level_id]` on the table `dashapp_athlete_association` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[leagueInfo_id,association_level_id]` on the table `dashapp_leagueinfo_association` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[team_id,association_level_id]` on the table `dashapp_team_association` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "dashapp_athlete_association_association_level_id_key";

-- DropIndex
DROP INDEX "dashapp_leagueinfo_association_association_level_id_key";

-- DropIndex
DROP INDEX "dashapp_team_association_association_level_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_athlete_association_athlete_id_association_level_id_key" ON "dashapp_athlete_association"("athlete_id", "association_level_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_association_leagueInfo_id_association_le_key" ON "dashapp_leagueinfo_association"("leagueInfo_id", "association_level_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_association_team_id_association_level_id_key" ON "dashapp_team_association"("team_id", "association_level_id");
