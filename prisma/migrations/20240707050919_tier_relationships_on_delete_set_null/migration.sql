-- DropForeignKey
ALTER TABLE "dashapp_athlete_tier" DROP CONSTRAINT "dashapp_athlete_tier_tier_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_tier" DROP CONSTRAINT "dashapp_companydata_tier_tier_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_tier" DROP CONSTRAINT "dashapp_leagueinfo_tier_tier_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_tier" DROP CONSTRAINT "dashapp_team_tier_tier_id_fkey";

-- AddForeignKey
ALTER TABLE "dashapp_athlete_tier" ADD CONSTRAINT "dashapp_athlete_tier_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "dashapp_tier"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_tier" ADD CONSTRAINT "dashapp_companydata_tier_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "dashapp_tier"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_tier" ADD CONSTRAINT "dashapp_leagueinfo_tier_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "dashapp_tier"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_tier" ADD CONSTRAINT "dashapp_team_tier_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "dashapp_tier"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
