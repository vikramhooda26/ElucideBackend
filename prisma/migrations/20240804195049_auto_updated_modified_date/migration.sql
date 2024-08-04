/*
  Warnings:

  - Made the column `modified_date` on table `association` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `association_level` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_activation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_activecampaigns` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_age` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_agency` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_assets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_athlete` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_athlete_status` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_athletecontact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_brandcontact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_brandendorsements` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_broadcastpartner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_companydata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_gender` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_hqcity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_keymarket` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_keyplatform` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_league` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_leaguecontact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_leagueendorsements` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_leagueinfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_leagueowner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_level` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_mainpersonality` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_marketingplatform` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_nccs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_ottpartner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_parentorg` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_partner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_property` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_reach` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_sport` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_sportsdealsummary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_states` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_subcategory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_subpersonality` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_taglines` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_team` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_teamcontact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_teamendorsements` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_teamowner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_territory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_tier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modified_date` on table `dashapp_viewership` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "association" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "association_level" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_activation" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_activecampaigns" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_age" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_agency" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_assets" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_athlete" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_athlete_status" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_athletecontact" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_brandcontact" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_brandendorsements" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_broadcastpartner" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_category" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_companydata" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_gender" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_hqcity" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_keymarket" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_keyplatform" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_league" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_leaguecontact" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_leagueendorsements" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_leagueinfo" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_leagueowner" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_level" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_mainpersonality" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_marketingplatform" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_nccs" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_ottpartner" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_parentorg" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_partner" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_property" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_reach" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_sport" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_sportsdealsummary" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_states" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_subcategory" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_subpersonality" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_taglines" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_team" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_teamcontact" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_teamendorsements" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_teamowner" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_territory" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_tier" ALTER COLUMN "modified_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_viewership" ALTER COLUMN "modified_date" SET NOT NULL;
