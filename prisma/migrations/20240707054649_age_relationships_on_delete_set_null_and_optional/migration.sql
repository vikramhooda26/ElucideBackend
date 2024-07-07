-- DropForeignKey
ALTER TABLE "dashapp_athlete_target_age" DROP CONSTRAINT "dashapp_athlete_target_age_age_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_age" DROP CONSTRAINT "dashapp_companydata_age_age_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_age" DROP CONSTRAINT "dashapp_leagueinfo_age_age_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_age" DROP CONSTRAINT "dashapp_team_age_age_id_fkey";

-- AlterTable
ALTER TABLE "dashapp_athlete_target_age" ALTER COLUMN "age_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_companydata_age" ALTER COLUMN "age_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_leagueinfo_age" ALTER COLUMN "age_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_team_age" ALTER COLUMN "age_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_target_age" ADD CONSTRAINT "dashapp_athlete_target_age_age_id_fkey" FOREIGN KEY ("age_id") REFERENCES "dashapp_age"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_age" ADD CONSTRAINT "dashapp_companydata_age_age_id_fkey" FOREIGN KEY ("age_id") REFERENCES "dashapp_age"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_age" ADD CONSTRAINT "dashapp_leagueinfo_age_age_id_fkey" FOREIGN KEY ("age_id") REFERENCES "dashapp_age"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_age" ADD CONSTRAINT "dashapp_team_age_age_id_fkey" FOREIGN KEY ("age_id") REFERENCES "dashapp_age"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
