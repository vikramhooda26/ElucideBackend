-- AlterTable
ALTER TABLE "dashapp_athlete_tier" ALTER COLUMN "tier_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_companydata_tier" ALTER COLUMN "tier_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_leagueinfo_tier" ALTER COLUMN "tier_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_team_tier" ALTER COLUMN "tier_id" DROP NOT NULL;
