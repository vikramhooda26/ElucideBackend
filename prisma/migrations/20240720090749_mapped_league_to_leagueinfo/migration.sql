-- AlterTable
ALTER TABLE "dashapp_leagueinfo" ADD COLUMN     "league_id" BIGINT;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo" ADD CONSTRAINT "dashapp_leagueinfo_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "dashapp_league"("id") ON DELETE CASCADE ON UPDATE CASCADE;
