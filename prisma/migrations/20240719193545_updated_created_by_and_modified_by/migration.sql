/*
  Warnings:

  - You are about to drop the column `created_by` on the `dashapp_activation` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_activecampaigns` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_age` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_agency` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_athlete` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_athletecontact` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_brandcontact` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_brandendorsements` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_broadcastpartner` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_companydata` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_gender` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_hqcity` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_income` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_keymarket` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_league` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_leaguecontact` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_leagueendorsements` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_leagueinfo` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_leagueowner` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_level` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_mainpersonality` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_marketingplatform` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_ottpartner` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_parentorg` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_partner` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_property` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_sport` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_sportsdealsummary` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_states` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_subpersonality` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_taglines` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_team` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_teamcontact` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_teamendorsements` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_teamowner` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_territory` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `dashapp_tier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dashapp_activation" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_activecampaigns" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_age" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_agency" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_athlete" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_athletecontact" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_brandcontact" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_brandendorsements" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_broadcastpartner" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_companydata" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_gender" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_hqcity" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_income" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_keymarket" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_league" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_leaguecontact" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_leagueendorsements" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_leagueinfo" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_leagueowner" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_level" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_mainpersonality" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_marketingplatform" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_ottpartner" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_parentorg" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_partner" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_property" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_sport" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_sportsdealsummary" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_states" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_subpersonality" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_taglines" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_team" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_teamcontact" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_teamendorsements" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_teamowner" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_territory" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "dashapp_tier" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" BIGINT;

-- AddForeignKey
ALTER TABLE "dashapp_activation" ADD CONSTRAINT "dashapp_activation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activecampaigns" ADD CONSTRAINT "dashapp_activecampaigns_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_age" ADD CONSTRAINT "dashapp_age_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_agency" ADD CONSTRAINT "dashapp_agency_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete" ADD CONSTRAINT "dashapp_athlete_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athletecontact" ADD CONSTRAINT "dashapp_athletecontact_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_brandcontact" ADD CONSTRAINT "dashapp_brandcontact_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_brandendorsements" ADD CONSTRAINT "dashapp_brandendorsements_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_broadcastpartner" ADD CONSTRAINT "dashapp_broadcastpartner_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata" ADD CONSTRAINT "dashapp_companydata_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_gender" ADD CONSTRAINT "dashapp_gender_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_hqcity" ADD CONSTRAINT "dashapp_hqcity_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_income" ADD CONSTRAINT "dashapp_income_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_keymarket" ADD CONSTRAINT "dashapp_keymarket_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_league" ADD CONSTRAINT "dashapp_league_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leaguecontact" ADD CONSTRAINT "dashapp_leaguecontact_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueendorsements" ADD CONSTRAINT "dashapp_leagueendorsements_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo" ADD CONSTRAINT "dashapp_leagueinfo_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueowner" ADD CONSTRAINT "dashapp_leagueowner_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_level" ADD CONSTRAINT "dashapp_level_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_mainpersonality" ADD CONSTRAINT "dashapp_mainpersonality_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_marketingplatform" ADD CONSTRAINT "dashapp_marketingplatform_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_ottpartner" ADD CONSTRAINT "dashapp_ottpartner_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_parentorg" ADD CONSTRAINT "dashapp_parentorg_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_partner" ADD CONSTRAINT "dashapp_partner_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_property" ADD CONSTRAINT "dashapp_property_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_sport" ADD CONSTRAINT "dashapp_sport_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_sportsdealsummary" ADD CONSTRAINT "dashapp_sportsdealsummary_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_states" ADD CONSTRAINT "dashapp_states_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_subpersonality" ADD CONSTRAINT "dashapp_subpersonality_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_taglines" ADD CONSTRAINT "dashapp_taglines_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team" ADD CONSTRAINT "dashapp_team_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_teamcontact" ADD CONSTRAINT "dashapp_teamcontact_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_teamendorsements" ADD CONSTRAINT "dashapp_teamendorsements_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_teamowner" ADD CONSTRAINT "dashapp_teamowner_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_territory" ADD CONSTRAINT "dashapp_territory_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_tier" ADD CONSTRAINT "dashapp_tier_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
