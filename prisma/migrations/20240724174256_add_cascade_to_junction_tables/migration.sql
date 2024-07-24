/*
  Warnings:

  - You are about to drop the `auth_group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_group_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_user_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_user_user_permissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "auth_group_permissions" DROP CONSTRAINT "auth_group_permissions_group_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_group_permissions" DROP CONSTRAINT "auth_group_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_permission" DROP CONSTRAINT "auth_permission_content_type_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_user_groups" DROP CONSTRAINT "auth_user_groups_group_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_user_groups" DROP CONSTRAINT "auth_user_groups_user_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_user_user_permissions" DROP CONSTRAINT "auth_user_user_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_user_user_permissions" DROP CONSTRAINT "auth_user_user_permissions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_activation_assets" DROP CONSTRAINT "dashapp_activation_assets_activation_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_activation_assets" DROP CONSTRAINT "dashapp_activation_assets_assets_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_activation_market" DROP CONSTRAINT "dashapp_activation_market_activation_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_activation_market" DROP CONSTRAINT "dashapp_activation_market_states_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_activation_type" DROP CONSTRAINT "dashapp_activation_type_activation_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_activation_type" DROP CONSTRAINT "dashapp_activation_type_marketingplatform_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_key_markets_primary" DROP CONSTRAINT "dashapp_athlete_key_markets_primary_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_key_markets_primary" DROP CONSTRAINT "dashapp_athlete_key_markets_primary_keymarket_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_key_markets_secondary" DROP CONSTRAINT "dashapp_athlete_key_markets_secondary_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_key_markets_secondary" DROP CONSTRAINT "dashapp_athlete_key_markets_secondary_keymarket_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_key_markets_tertiary" DROP CONSTRAINT "dashapp_athlete_key_markets_tertiary_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_key_markets_tertiary" DROP CONSTRAINT "dashapp_athlete_key_markets_tertiary_states_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_personality_traits" DROP CONSTRAINT "dashapp_athlete_personality_traits_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_target_age" DROP CONSTRAINT "dashapp_athlete_target_age_age_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_target_age" DROP CONSTRAINT "dashapp_athlete_target_age_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_target_gender" DROP CONSTRAINT "dashapp_athlete_target_gender_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_target_gender" DROP CONSTRAINT "dashapp_athlete_target_gender_gender_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_target_income" DROP CONSTRAINT "dashapp_athlete_target_income_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_target_income" DROP CONSTRAINT "dashapp_athlete_target_income_income_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_tier" DROP CONSTRAINT "dashapp_athlete_tier_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_athlete_tier" DROP CONSTRAINT "dashapp_athlete_tier_tier_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_active_campaigns" DROP CONSTRAINT "dashapp_companydata_active_campaigns_activecampaigns_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_active_campaigns" DROP CONSTRAINT "dashapp_companydata_active_campaigns_companydata_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_age" DROP CONSTRAINT "dashapp_companydata_age_age_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_age" DROP CONSTRAINT "dashapp_companydata_age_companydata_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_gender" DROP CONSTRAINT "dashapp_companydata_gender_companydata_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_gender" DROP CONSTRAINT "dashapp_companydata_gender_gender_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_income" DROP CONSTRAINT "dashapp_companydata_income_companydata_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_income" DROP CONSTRAINT "dashapp_companydata_income_income_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_key_markets_primary" DROP CONSTRAINT "dashapp_companydata_key_markets_primary_companydata_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_key_markets_primary" DROP CONSTRAINT "dashapp_companydata_key_markets_primary_keymarket_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_key_markets_secondary" DROP CONSTRAINT "dashapp_companydata_key_markets_secondary_companydata_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_key_markets_secondary" DROP CONSTRAINT "dashapp_companydata_key_markets_secondary_keymarket_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_key_markets_tertiary" DROP CONSTRAINT "dashapp_companydata_key_markets_tertiary_companydata_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_key_markets_tertiary" DROP CONSTRAINT "dashapp_companydata_key_markets_tertiary_states_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_marketing_platforms_primary" DROP CONSTRAINT "dashapp_companydata_marketing_platfor_marketingplatform_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_marketing_platforms_primary" DROP CONSTRAINT "dashapp_companydata_marketing_platforms_pri_companydata_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_marketing_platforms_secondary" DROP CONSTRAINT "dashapp_companydata_marketing_platfo_marketingplatform_id_fkey1";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_marketing_platforms_secondary" DROP CONSTRAINT "dashapp_companydata_marketing_platforms_sec_companydata_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_personality_traits" DROP CONSTRAINT "dashapp_companydata_personality_traits_companydata_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_subcategory" DROP CONSTRAINT "dashapp_companydata_subcategory_companydata_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_taglines" DROP CONSTRAINT "dashapp_companydata_taglines_companydata_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_taglines" DROP CONSTRAINT "dashapp_companydata_taglines_taglines_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_tier" DROP CONSTRAINT "dashapp_companydata_tier_companydata_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_companydata_tier" DROP CONSTRAINT "dashapp_companydata_tier_tier_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_active_campaigns" DROP CONSTRAINT "dashapp_leagueinfo_active_campaigns_activecampaigns_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_active_campaigns" DROP CONSTRAINT "dashapp_leagueinfo_active_campaigns_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_age" DROP CONSTRAINT "dashapp_leagueinfo_age_age_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_age" DROP CONSTRAINT "dashapp_leagueinfo_age_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_gender" DROP CONSTRAINT "dashapp_leagueinfo_gender_gender_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_gender" DROP CONSTRAINT "dashapp_leagueinfo_gender_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_income" DROP CONSTRAINT "dashapp_leagueinfo_income_income_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_income" DROP CONSTRAINT "dashapp_leagueinfo_income_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_primary" DROP CONSTRAINT "dashapp_leagueinfo_key_markets_primary_keymarket_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_primary" DROP CONSTRAINT "dashapp_leagueinfo_key_markets_primary_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_secondary" DROP CONSTRAINT "dashapp_leagueinfo_key_markets_secondary_keymarket_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_secondary" DROP CONSTRAINT "dashapp_leagueinfo_key_markets_secondary_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_tertiary" DROP CONSTRAINT "dashapp_leagueinfo_key_markets_tertiary_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_tertiary" DROP CONSTRAINT "dashapp_leagueinfo_key_markets_tertiary_states_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_marketing_platforms_primary" DROP CONSTRAINT "dashapp_leagueinfo_marketing_platform_marketingplatform_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_marketing_platforms_primary" DROP CONSTRAINT "dashapp_leagueinfo_marketing_platforms_prima_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_marketing_platforms_secondary" DROP CONSTRAINT "dashapp_leagueinfo_marketing_platfor_marketingplatform_id_fkey1";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_marketing_platforms_secondary" DROP CONSTRAINT "dashapp_leagueinfo_marketing_platforms_secon_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_owner" DROP CONSTRAINT "dashapp_leagueinfo_owner_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_owner" DROP CONSTRAINT "dashapp_leagueinfo_owner_leagueowner_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_personality_traits" DROP CONSTRAINT "dashapp_leagueinfo_personality_traits_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_taglines" DROP CONSTRAINT "dashapp_leagueinfo_taglines_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_taglines" DROP CONSTRAINT "dashapp_leagueinfo_taglines_taglines_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_tier" DROP CONSTRAINT "dashapp_leagueinfo_tier_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_leagueinfo_tier" DROP CONSTRAINT "dashapp_leagueinfo_tier_tier_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_sportsdealsummary" DROP CONSTRAINT "dashapp_sportsdealsummary_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_sportsdealsummary" DROP CONSTRAINT "dashapp_sportsdealsummary_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_sportsdealsummary" DROP CONSTRAINT "dashapp_sportsdealsummary_league_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_sportsdealsummary" DROP CONSTRAINT "dashapp_sportsdealsummary_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_active_campaigns" DROP CONSTRAINT "dashapp_team_active_campaigns_activecampaigns_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_active_campaigns" DROP CONSTRAINT "dashapp_team_active_campaigns_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_age" DROP CONSTRAINT "dashapp_team_age_age_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_age" DROP CONSTRAINT "dashapp_team_age_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_gender" DROP CONSTRAINT "dashapp_team_gender_gender_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_gender" DROP CONSTRAINT "dashapp_team_gender_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_income" DROP CONSTRAINT "dashapp_team_income_income_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_income" DROP CONSTRAINT "dashapp_team_income_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_key_markets_primary" DROP CONSTRAINT "dashapp_team_key_markets_primary_keymarket_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_key_markets_primary" DROP CONSTRAINT "dashapp_team_key_markets_primary_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_key_markets_secondary" DROP CONSTRAINT "dashapp_team_key_markets_secondary_keymarket_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_key_markets_secondary" DROP CONSTRAINT "dashapp_team_key_markets_secondary_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_key_markets_tertiary" DROP CONSTRAINT "dashapp_team_key_markets_tertiary_states_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_key_markets_tertiary" DROP CONSTRAINT "dashapp_team_key_markets_tertiary_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_marketing_platforms_primary" DROP CONSTRAINT "dashapp_team_marketing_platforms_prim_marketingplatform_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_marketing_platforms_primary" DROP CONSTRAINT "dashapp_team_marketing_platforms_primary_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_marketing_platforms_secondary" DROP CONSTRAINT "dashapp_team_marketing_platforms_seco_marketingplatform_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_marketing_platforms_secondary" DROP CONSTRAINT "dashapp_team_marketing_platforms_secondary_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_owner" DROP CONSTRAINT "dashapp_team_owner_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_owner" DROP CONSTRAINT "dashapp_team_owner_teamowner_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_personality_traits" DROP CONSTRAINT "dashapp_team_personality_traits_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_taglines" DROP CONSTRAINT "dashapp_team_taglines_taglines_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_taglines" DROP CONSTRAINT "dashapp_team_taglines_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_tier" DROP CONSTRAINT "dashapp_team_tier_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_team_tier" DROP CONSTRAINT "dashapp_team_tier_tier_id_fkey";

-- DropTable
DROP TABLE "auth_group";

-- DropTable
DROP TABLE "auth_group_permissions";

-- DropTable
DROP TABLE "auth_permission";

-- DropTable
DROP TABLE "auth_user_groups";

-- DropTable
DROP TABLE "auth_user_user_permissions";

-- AddForeignKey
ALTER TABLE "dashapp_activation_assets" ADD CONSTRAINT "dashapp_activation_assets_activation_id_fkey" FOREIGN KEY ("activation_id") REFERENCES "dashapp_activation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_activation_assets" ADD CONSTRAINT "dashapp_activation_assets_assets_id_fkey" FOREIGN KEY ("assets_id") REFERENCES "dashapp_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_activation_market" ADD CONSTRAINT "dashapp_activation_market_activation_id_fkey" FOREIGN KEY ("activation_id") REFERENCES "dashapp_activation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_activation_market" ADD CONSTRAINT "dashapp_activation_market_states_id_fkey" FOREIGN KEY ("states_id") REFERENCES "dashapp_states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_activation_type" ADD CONSTRAINT "dashapp_activation_type_activation_id_fkey" FOREIGN KEY ("activation_id") REFERENCES "dashapp_activation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_activation_type" ADD CONSTRAINT "dashapp_activation_type_marketingplatform_id_fkey" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_key_markets_primary" ADD CONSTRAINT "dashapp_athlete_key_markets_primary_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_key_markets_primary" ADD CONSTRAINT "dashapp_athlete_key_markets_primary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_key_markets_secondary" ADD CONSTRAINT "dashapp_athlete_key_markets_secondary_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_key_markets_secondary" ADD CONSTRAINT "dashapp_athlete_key_markets_secondary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_key_markets_tertiary" ADD CONSTRAINT "dashapp_athlete_key_markets_tertiary_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_key_markets_tertiary" ADD CONSTRAINT "dashapp_athlete_key_markets_tertiary_states_id_fkey" FOREIGN KEY ("states_id") REFERENCES "dashapp_states"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_personality_traits" ADD CONSTRAINT "dashapp_athlete_personality_traits_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_target_age" ADD CONSTRAINT "dashapp_athlete_target_age_age_id_fkey" FOREIGN KEY ("age_id") REFERENCES "dashapp_age"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_target_age" ADD CONSTRAINT "dashapp_athlete_target_age_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_target_gender" ADD CONSTRAINT "dashapp_athlete_target_gender_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_target_gender" ADD CONSTRAINT "dashapp_athlete_target_gender_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "dashapp_gender"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_target_income" ADD CONSTRAINT "dashapp_athlete_target_income_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_target_income" ADD CONSTRAINT "dashapp_athlete_target_income_income_id_fkey" FOREIGN KEY ("income_id") REFERENCES "dashapp_income"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_tier" ADD CONSTRAINT "dashapp_athlete_tier_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_tier" ADD CONSTRAINT "dashapp_athlete_tier_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "dashapp_tier"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_active_campaigns" ADD CONSTRAINT "dashapp_companydata_active_campaigns_activecampaigns_id_fkey" FOREIGN KEY ("activecampaigns_id") REFERENCES "dashapp_activecampaigns"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_active_campaigns" ADD CONSTRAINT "dashapp_companydata_active_campaigns_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_age" ADD CONSTRAINT "dashapp_companydata_age_age_id_fkey" FOREIGN KEY ("age_id") REFERENCES "dashapp_age"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_age" ADD CONSTRAINT "dashapp_companydata_age_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_gender" ADD CONSTRAINT "dashapp_companydata_gender_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_gender" ADD CONSTRAINT "dashapp_companydata_gender_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "dashapp_gender"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_income" ADD CONSTRAINT "dashapp_companydata_income_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_income" ADD CONSTRAINT "dashapp_companydata_income_income_id_fkey" FOREIGN KEY ("income_id") REFERENCES "dashapp_income"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_key_markets_primary" ADD CONSTRAINT "dashapp_companydata_key_markets_primary_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_key_markets_primary" ADD CONSTRAINT "dashapp_companydata_key_markets_primary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_key_markets_secondary" ADD CONSTRAINT "dashapp_companydata_key_markets_secondary_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_key_markets_secondary" ADD CONSTRAINT "dashapp_companydata_key_markets_secondary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_key_markets_tertiary" ADD CONSTRAINT "dashapp_companydata_key_markets_tertiary_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_key_markets_tertiary" ADD CONSTRAINT "dashapp_companydata_key_markets_tertiary_states_id_fkey" FOREIGN KEY ("states_id") REFERENCES "dashapp_states"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_marketing_platforms_primary" ADD CONSTRAINT "dashapp_companydata_marketing_platfor_marketingplatform_id_fkey" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_marketing_platforms_primary" ADD CONSTRAINT "dashapp_companydata_marketing_platforms_pri_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_marketing_platforms_secondary" ADD CONSTRAINT "dashapp_companydata_marketing_platfo_marketingplatform_id_fkey1" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_marketing_platforms_secondary" ADD CONSTRAINT "dashapp_companydata_marketing_platforms_sec_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_personality_traits" ADD CONSTRAINT "dashapp_companydata_personality_traits_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_subcategory" ADD CONSTRAINT "dashapp_companydata_subcategory_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_taglines" ADD CONSTRAINT "dashapp_companydata_taglines_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_taglines" ADD CONSTRAINT "dashapp_companydata_taglines_taglines_id_fkey" FOREIGN KEY ("taglines_id") REFERENCES "dashapp_taglines"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_tier" ADD CONSTRAINT "dashapp_companydata_tier_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_tier" ADD CONSTRAINT "dashapp_companydata_tier_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "dashapp_tier"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_active_campaigns" ADD CONSTRAINT "dashapp_leagueinfo_active_campaigns_activecampaigns_id_fkey" FOREIGN KEY ("activecampaigns_id") REFERENCES "dashapp_activecampaigns"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_active_campaigns" ADD CONSTRAINT "dashapp_leagueinfo_active_campaigns_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_age" ADD CONSTRAINT "dashapp_leagueinfo_age_age_id_fkey" FOREIGN KEY ("age_id") REFERENCES "dashapp_age"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_age" ADD CONSTRAINT "dashapp_leagueinfo_age_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_gender" ADD CONSTRAINT "dashapp_leagueinfo_gender_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "dashapp_gender"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_gender" ADD CONSTRAINT "dashapp_leagueinfo_gender_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_income" ADD CONSTRAINT "dashapp_leagueinfo_income_income_id_fkey" FOREIGN KEY ("income_id") REFERENCES "dashapp_income"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_income" ADD CONSTRAINT "dashapp_leagueinfo_income_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_primary" ADD CONSTRAINT "dashapp_leagueinfo_key_markets_primary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_primary" ADD CONSTRAINT "dashapp_leagueinfo_key_markets_primary_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_secondary" ADD CONSTRAINT "dashapp_leagueinfo_key_markets_secondary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_secondary" ADD CONSTRAINT "dashapp_leagueinfo_key_markets_secondary_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_tertiary" ADD CONSTRAINT "dashapp_leagueinfo_key_markets_tertiary_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_tertiary" ADD CONSTRAINT "dashapp_leagueinfo_key_markets_tertiary_states_id_fkey" FOREIGN KEY ("states_id") REFERENCES "dashapp_states"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_marketing_platforms_primary" ADD CONSTRAINT "dashapp_leagueinfo_marketing_platform_marketingplatform_id_fkey" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_marketing_platforms_primary" ADD CONSTRAINT "dashapp_leagueinfo_marketing_platforms_prima_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_marketing_platforms_secondary" ADD CONSTRAINT "dashapp_leagueinfo_marketing_platfor_marketingplatform_id_fkey1" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_marketing_platforms_secondary" ADD CONSTRAINT "dashapp_leagueinfo_marketing_platforms_secon_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_owner" ADD CONSTRAINT "dashapp_leagueinfo_owner_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_owner" ADD CONSTRAINT "dashapp_leagueinfo_owner_leagueowner_id_fkey" FOREIGN KEY ("leagueowner_id") REFERENCES "dashapp_leagueowner"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_personality_traits" ADD CONSTRAINT "dashapp_leagueinfo_personality_traits_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_taglines" ADD CONSTRAINT "dashapp_leagueinfo_taglines_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_taglines" ADD CONSTRAINT "dashapp_leagueinfo_taglines_taglines_id_fkey" FOREIGN KEY ("taglines_id") REFERENCES "dashapp_taglines"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_tier" ADD CONSTRAINT "dashapp_leagueinfo_tier_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_tier" ADD CONSTRAINT "dashapp_leagueinfo_tier_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "dashapp_tier"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_sportsdealsummary" ADD CONSTRAINT "dashapp_sportsdealsummary_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_sportsdealsummary" ADD CONSTRAINT "dashapp_sportsdealsummary_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "dashapp_companydata"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_sportsdealsummary" ADD CONSTRAINT "dashapp_sportsdealsummary_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_sportsdealsummary" ADD CONSTRAINT "dashapp_sportsdealsummary_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_active_campaigns" ADD CONSTRAINT "dashapp_team_active_campaigns_activecampaigns_id_fkey" FOREIGN KEY ("activecampaigns_id") REFERENCES "dashapp_activecampaigns"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_active_campaigns" ADD CONSTRAINT "dashapp_team_active_campaigns_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_age" ADD CONSTRAINT "dashapp_team_age_age_id_fkey" FOREIGN KEY ("age_id") REFERENCES "dashapp_age"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_age" ADD CONSTRAINT "dashapp_team_age_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_gender" ADD CONSTRAINT "dashapp_team_gender_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "dashapp_gender"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_gender" ADD CONSTRAINT "dashapp_team_gender_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_income" ADD CONSTRAINT "dashapp_team_income_income_id_fkey" FOREIGN KEY ("income_id") REFERENCES "dashapp_income"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_income" ADD CONSTRAINT "dashapp_team_income_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_key_markets_primary" ADD CONSTRAINT "dashapp_team_key_markets_primary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_key_markets_primary" ADD CONSTRAINT "dashapp_team_key_markets_primary_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_key_markets_secondary" ADD CONSTRAINT "dashapp_team_key_markets_secondary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_key_markets_secondary" ADD CONSTRAINT "dashapp_team_key_markets_secondary_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_key_markets_tertiary" ADD CONSTRAINT "dashapp_team_key_markets_tertiary_states_id_fkey" FOREIGN KEY ("states_id") REFERENCES "dashapp_states"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_key_markets_tertiary" ADD CONSTRAINT "dashapp_team_key_markets_tertiary_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_marketing_platforms_primary" ADD CONSTRAINT "dashapp_team_marketing_platforms_prim_marketingplatform_id_fkey" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_marketing_platforms_primary" ADD CONSTRAINT "dashapp_team_marketing_platforms_primary_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_marketing_platforms_secondary" ADD CONSTRAINT "dashapp_team_marketing_platforms_seco_marketingplatform_id_fkey" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_marketing_platforms_secondary" ADD CONSTRAINT "dashapp_team_marketing_platforms_secondary_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_owner" ADD CONSTRAINT "dashapp_team_owner_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_owner" ADD CONSTRAINT "dashapp_team_owner_teamowner_id_fkey" FOREIGN KEY ("teamowner_id") REFERENCES "dashapp_teamowner"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_personality_traits" ADD CONSTRAINT "dashapp_team_personality_traits_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_taglines" ADD CONSTRAINT "dashapp_team_taglines_taglines_id_fkey" FOREIGN KEY ("taglines_id") REFERENCES "dashapp_taglines"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_taglines" ADD CONSTRAINT "dashapp_team_taglines_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_tier" ADD CONSTRAINT "dashapp_team_tier_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_tier" ADD CONSTRAINT "dashapp_team_tier_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "dashapp_tier"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
