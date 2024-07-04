/*
  Warnings:

  - Made the column `created_date` on table `dashapp_activation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_activecampaigns` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_age` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_agency` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_assets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_athlete` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_athletecontact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_brandcontact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_brandendorsements` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_broadcastpartner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_companydata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_gender` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_hqcity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_income` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_keymarket` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_league` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_leaguecontact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_leagueendorsements` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_leagueinfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_leagueowner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_level` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_mainpersonality` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_marketingplatform` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_ottpartner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_parentorg` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_partner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_property` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_sport` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_sportsdealsummary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_states` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_subpersonality` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_taglines` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_team` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_teamcontact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_teamendorsements` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_teamowner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_territory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_date` on table `dashapp_tier` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "dashapp_athlete_personality_traits" DROP CONSTRAINT "dashapp_athlete_personality_traits_subpersonality_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_personality_traits" DROP CONSTRAINT "dashapp_companydata_personality_traits_subpersonality_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_personality_traits" DROP CONSTRAINT "dashapp_leagueinfo_personality_traits_subpersonality_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_personality_traits" DROP CONSTRAINT "dashapp_team_personality_traits_subpersonality_id_fkey";

-- AlterTable
ALTER TABLE "dashapp_activation" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_activecampaigns" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_age" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_agency" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_assets" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_athlete" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_athletecontact" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_brandcontact" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_brandendorsements" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_broadcastpartner" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_category" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_companydata" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_gender" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_hqcity" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_income" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_keymarket" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_league" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_leaguecontact" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_leagueendorsements" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_leagueinfo" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_leagueowner" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_level" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_mainpersonality" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_marketingplatform" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_ottpartner" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_parentorg" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_partner" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_property" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_sport" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_sportsdealsummary" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_states" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_subpersonality" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_taglines" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_team" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_teamcontact" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_teamendorsements" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_teamowner" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_territory" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashapp_tier" ALTER COLUMN "created_date" SET NOT NULL,
ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "modified_date" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "dashapp_metric" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,
    "viewship_type" "viewship_type",
    "viewership" TEXT,
    "reach" TEXT,
    "year" TEXT,
    "leagueinfo_id" BIGINT,
    "team_id" BIGINT,

    CONSTRAINT "dashapp_metric_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dashapp_metric" ADD CONSTRAINT "dashapp_metric_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_metric" ADD CONSTRAINT "dashapp_metric_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_metric" ADD CONSTRAINT "dashapp_metric_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_metric" ADD CONSTRAINT "dashapp_metric_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_personality_traits" ADD CONSTRAINT "dashapp_athlete_personality_traits_subpersonality_id_fkey" FOREIGN KEY ("subpersonality_id") REFERENCES "dashapp_subpersonality"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_personality_traits" ADD CONSTRAINT "dashapp_companydata_personality_traits_subpersonality_id_fkey" FOREIGN KEY ("subpersonality_id") REFERENCES "dashapp_subpersonality"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_personality_traits" ADD CONSTRAINT "dashapp_leagueinfo_personality_traits_subpersonality_id_fkey" FOREIGN KEY ("subpersonality_id") REFERENCES "dashapp_subpersonality"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_personality_traits" ADD CONSTRAINT "dashapp_team_personality_traits_subpersonality_id_fkey" FOREIGN KEY ("subpersonality_id") REFERENCES "dashapp_subpersonality"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
