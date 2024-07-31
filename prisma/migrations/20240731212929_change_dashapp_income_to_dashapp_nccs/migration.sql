/*
  Warnings:

  - You are about to drop the `dashapp_income` table. If the table is not empty, all the data it contains will be lost.

*/ -- DropForeignKey

ALTER TABLE "dashapp_athlete_target_income"
DROP CONSTRAINT "dashapp_athlete_target_income_income_id_fkey";

-- DropForeignKey

ALTER TABLE "dashapp_companydata_income"
DROP CONSTRAINT "dashapp_companydata_income_income_id_fkey";

-- DropForeignKey

ALTER TABLE "dashapp_income"
DROP CONSTRAINT "dashapp_income_created_by_id_fkey";

-- DropForeignKey

ALTER TABLE "dashapp_income"
DROP CONSTRAINT "dashapp_income_modified_by_id_fkey";

-- DropForeignKey

ALTER TABLE "dashapp_leagueinfo_income"
DROP CONSTRAINT "dashapp_leagueinfo_income_income_id_fkey";

-- DropForeignKey

ALTER TABLE "dashapp_team_income"
DROP CONSTRAINT "dashapp_team_income_income_id_fkey";

-- AlterTable

ALTER TABLE IF EXISTS "dashapp_income" RENAME TO "dashapp_nccs";

-- AddForeignKey

ALTER TABLE "dashapp_athlete_target_income" ADD CONSTRAINT "dashapp_athlete_target_income_income_id_fkey"
FOREIGN KEY ("income_id") REFERENCES "dashapp_nccs"("id") ON
DELETE CASCADE ON
UPDATE NO ACTION;

-- AddForeignKey

ALTER TABLE "dashapp_companydata_income" ADD CONSTRAINT "dashapp_companydata_income_income_id_fkey"
FOREIGN KEY ("income_id") REFERENCES "dashapp_nccs"("id") ON
DELETE CASCADE ON
UPDATE NO ACTION;

-- AddForeignKey

ALTER TABLE "dashapp_nccs" ADD CONSTRAINT "dashapp_nccs_created_by_id_fkey"
FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON
DELETE
SET NULL ON
UPDATE NO ACTION;

-- AddForeignKey

ALTER TABLE "dashapp_nccs" ADD CONSTRAINT "dashapp_nccs_modified_by_id_fkey"
FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON
DELETE NO ACTION ON
UPDATE NO ACTION;

-- AddForeignKey

ALTER TABLE "dashapp_leagueinfo_income" ADD CONSTRAINT "dashapp_leagueinfo_income_income_id_fkey"
FOREIGN KEY ("income_id") REFERENCES "dashapp_nccs"("id") ON
DELETE CASCADE ON
UPDATE NO ACTION;

-- AddForeignKey

ALTER TABLE "dashapp_team_income" ADD CONSTRAINT "dashapp_team_income_income_id_fkey"
FOREIGN KEY ("income_id") REFERENCES "dashapp_nccs"("id") ON
DELETE CASCADE ON
UPDATE NO ACTION;

