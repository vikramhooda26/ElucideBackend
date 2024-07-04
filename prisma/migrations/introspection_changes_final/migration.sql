-- CreateTable
CREATE TABLE "auth_group" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,

    CONSTRAINT "auth_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_group_permissions" (
    "id" BIGSERIAL NOT NULL,
    "group_id" BIGINT NOT NULL,
    "permission_id" BIGINT NOT NULL,

    CONSTRAINT "auth_group_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_permission" (
    "id" BIGSERIAL NOT NULL,
    "content_type_id" BIGINT NOT NULL,
    "codename" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "auth_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_user" (
    "id" BIGSERIAL NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "last_login" TIMESTAMP(6),
    "is_superuser" BOOLEAN NOT NULL,
    "username" VARCHAR(150) NOT NULL,
    "last_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "is_staff" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "date_joined" TIMESTAMP(6) NOT NULL,
    "first_name" VARCHAR(150) NOT NULL,

    CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_user_groups" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "group_id" BIGINT NOT NULL,

    CONSTRAINT "auth_user_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_user_user_permissions" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "permission_id" BIGINT NOT NULL,

    CONSTRAINT "auth_user_user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_activation" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "Year" VARCHAR(32),
    "brand_id" BIGINT,
    "league_id" BIGINT,
    "modified_by_id" BIGINT,
    "team_id" BIGINT,
    "athlete_id" BIGINT,
    "name" VARCHAR(512),

    CONSTRAINT "dashapp_activation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_activation_assets" (
    "id" BIGSERIAL NOT NULL,
    "activation_id" BIGINT NOT NULL,
    "assets_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_activation_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_activation_market" (
    "id" BIGSERIAL NOT NULL,
    "activation_id" BIGINT NOT NULL,
    "states_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_activation_market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_activation_property" (
    "id" BIGSERIAL NOT NULL,
    "activation_id" BIGINT NOT NULL,
    "property_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_activation_property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_activation_type" (
    "id" BIGSERIAL NOT NULL,
    "activation_id" BIGINT NOT NULL,
    "marketingplatform_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_activation_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_activecampaigns" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_activecampaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_age" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "modified_by_id" BIGINT,
    "modified_date" TIMESTAMP(6) NOT NULL,
    "created_by" VARCHAR(60),
    "age_range" VARCHAR(20) NOT NULL,

    CONSTRAINT "dashapp_age_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_agency" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_assets" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_athlete" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "athlete_name" VARCHAR(512) NOT NULL,
    "nationality" VARCHAR(512),
    "instagram" VARCHAR(512),
    "facebook" VARCHAR(512),
    "twitter" VARCHAR(512),
    "linkedin" VARCHAR(512),
    "website" VARCHAR(512),
    "agency_id" BIGINT,
    "modified_by_id" BIGINT,
    "sport_id" BIGINT,
    "budget_range_from" DOUBLE PRECISION,
    "budget_range_to" DOUBLE PRECISION,
    "youtube" VARCHAR(512),

    CONSTRAINT "dashapp_athlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_athlete_key_markets_primary" (
    "id" BIGSERIAL NOT NULL,
    "athlete_id" BIGINT NOT NULL,
    "keymarket_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_athlete_key_markets_primary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_athlete_key_markets_secondary" (
    "id" BIGSERIAL NOT NULL,
    "athlete_id" BIGINT NOT NULL,
    "keymarket_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_athlete_key_markets_secondary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_athlete_key_markets_tertiary" (
    "id" BIGSERIAL NOT NULL,
    "athlete_id" BIGINT NOT NULL,
    "states_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_athlete_key_markets_tertiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_athlete_personality_traits" (
    "id" BIGSERIAL NOT NULL,
    "athlete_id" BIGINT NOT NULL,
    "subpersonality_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_athlete_personality_traits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_athlete_target_age" (
    "id" BIGSERIAL NOT NULL,
    "athlete_id" BIGINT NOT NULL,
    "age_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_athlete_target_age_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_athlete_target_gender" (
    "id" BIGSERIAL NOT NULL,
    "athlete_id" BIGINT NOT NULL,
    "gender_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_athlete_target_gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_athlete_target_income" (
    "id" BIGSERIAL NOT NULL,
    "athlete_id" BIGINT NOT NULL,
    "income_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_athlete_target_income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_athlete_tier" (
    "id" BIGSERIAL NOT NULL,
    "athlete_id" BIGINT NOT NULL,
    "tier_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_athlete_tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_athletecontact" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "contact_name" VARCHAR(512) NOT NULL,
    "contact_designation" VARCHAR(512),
    "contact_email" VARCHAR(512),
    "contact_linkedin" VARCHAR(512),
    "athlete_id" BIGINT NOT NULL,
    "modified_by_id" BIGINT,
    "contact_no" VARCHAR(512),

    CONSTRAINT "dashapp_athletecontact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_brandcontact" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "contact_name" VARCHAR(512) NOT NULL,
    "contact_designation" VARCHAR(512),
    "contact_email" VARCHAR(512),
    "contact_linkedin" VARCHAR(512),
    "brand_id" BIGINT NOT NULL,
    "modified_by_id" BIGINT,
    "contact_no" VARCHAR(512),

    CONSTRAINT "dashapp_brandcontact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_brandendorsements" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "brand_id" BIGINT NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_brandendorsements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_broadcastpartner" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_broadcastpartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_category" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_companydata" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "company_name" VARCHAR(512) NOT NULL,
    "hq_state" VARCHAR(50),
    "instagram" VARCHAR(512),
    "facebook" VARCHAR(512),
    "twitter" VARCHAR(512),
    "linkedin" VARCHAR(512),
    "website" VARCHAR(512),
    "strategy_overview" TEXT,
    "agency_id" BIGINT,
    "category_id" BIGINT,
    "hq_city_id" BIGINT,
    "modified_by_id" BIGINT,
    "parent_organization_id" BIGINT,
    "youtube" VARCHAR(512),

    CONSTRAINT "dashapp_companydata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_companydata_active_campaigns" (
    "id" BIGSERIAL NOT NULL,
    "companydata_id" BIGINT NOT NULL,
    "activecampaigns_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_companydata_active_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_companydata_age" (
    "id" BIGSERIAL NOT NULL,
    "companydata_id" BIGINT NOT NULL,
    "age_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_companydata_age_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_companydata_gender" (
    "id" BIGSERIAL NOT NULL,
    "companydata_id" BIGINT NOT NULL,
    "gender_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_companydata_gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_companydata_income" (
    "id" BIGSERIAL NOT NULL,
    "companydata_id" BIGINT NOT NULL,
    "income_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_companydata_income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_companydata_key_markets_primary" (
    "id" BIGSERIAL NOT NULL,
    "companydata_id" BIGINT NOT NULL,
    "keymarket_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_companydata_key_markets_primary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_companydata_key_markets_secondary" (
    "id" BIGSERIAL NOT NULL,
    "companydata_id" BIGINT NOT NULL,
    "keymarket_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_companydata_key_markets_secondary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_companydata_key_markets_tertiary" (
    "id" BIGSERIAL NOT NULL,
    "companydata_id" BIGINT NOT NULL,
    "states_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_companydata_key_markets_tertiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_companydata_marketing_platforms_primary" (
    "id" BIGSERIAL NOT NULL,
    "companydata_id" BIGINT NOT NULL,
    "marketingplatform_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_companydata_marketing_platforms_primary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_companydata_marketing_platforms_secondary" (
    "id" BIGSERIAL NOT NULL,
    "companydata_id" BIGINT NOT NULL,
    "marketingplatform_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_companydata_marketing_platforms_secondary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_companydata_personality_traits" (
    "id" BIGSERIAL NOT NULL,
    "companydata_id" BIGINT NOT NULL,
    "subpersonality_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_companydata_personality_traits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_companydata_taglines" (
    "id" BIGSERIAL NOT NULL,
    "companydata_id" BIGINT NOT NULL,
    "taglines_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_companydata_taglines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_companydata_tier" (
    "id" BIGSERIAL NOT NULL,
    "companydata_id" BIGINT NOT NULL,
    "tier_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_companydata_tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_gender" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "modified_by_id" BIGINT,
    "modified_date" TIMESTAMP(6) NOT NULL,
    "created_by" VARCHAR(60),
    "gender_is" VARCHAR(20) NOT NULL,

    CONSTRAINT "dashapp_gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_hqcity" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_hqcity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_income" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "modified_by_id" BIGINT,
    "modified_date" TIMESTAMP(6) NOT NULL,
    "created_by" VARCHAR(60),
    "income_class" VARCHAR(20) NOT NULL,

    CONSTRAINT "dashapp_income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_keymarket" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "modified_by_id" BIGINT,
    "modified_date" TIMESTAMP(6) NOT NULL,
    "created_by" VARCHAR(60),
    "zone" VARCHAR(20) NOT NULL,

    CONSTRAINT "dashapp_keymarket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_league" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_league_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leaguecontact" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "contact_name" VARCHAR(512) NOT NULL,
    "contact_designation" VARCHAR(512),
    "contact_email" VARCHAR(512),
    "contact_linkedin" VARCHAR(512),
    "league_id" BIGINT NOT NULL,
    "modified_by_id" BIGINT,
    "contact_no" VARCHAR(512),

    CONSTRAINT "dashapp_leaguecontact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueendorsements" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "league_id" BIGINT NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_leagueendorsements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "year_of_inception" VARCHAR(512),
    "format" VARCHAR(32),
    "instagram" VARCHAR(512),
    "facebook" VARCHAR(512),
    "twitter" VARCHAR(512),
    "linkedin" VARCHAR(512),
    "website" VARCHAR(512),
    "strategy_overview" TEXT,
    "brodcast_partner_id" BIGINT,
    "modified_by_id" BIGINT,
    "ott_partner_id" BIGINT,
    "sport_id" BIGINT,
    "property_name" VARCHAR(512) NOT NULL,
    "budget_range_from" DOUBLE PRECISION,
    "budget_range_to" DOUBLE PRECISION,
    "youtube" VARCHAR(512),

    CONSTRAINT "dashapp_leagueinfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_active_campaigns" (
    "id" BIGSERIAL NOT NULL,
    "leagueinfo_id" BIGINT NOT NULL,
    "activecampaigns_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_leagueinfo_active_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_age" (
    "id" BIGSERIAL NOT NULL,
    "leagueinfo_id" BIGINT NOT NULL,
    "age_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_leagueinfo_age_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_gender" (
    "id" BIGSERIAL NOT NULL,
    "leagueinfo_id" BIGINT NOT NULL,
    "gender_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_leagueinfo_gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_income" (
    "id" BIGSERIAL NOT NULL,
    "leagueinfo_id" BIGINT NOT NULL,
    "income_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_leagueinfo_income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_key_markets_primary" (
    "id" BIGSERIAL NOT NULL,
    "leagueinfo_id" BIGINT NOT NULL,
    "keymarket_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_leagueinfo_key_markets_primary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_key_markets_secondary" (
    "id" BIGSERIAL NOT NULL,
    "leagueinfo_id" BIGINT NOT NULL,
    "keymarket_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_leagueinfo_key_markets_secondary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_key_markets_tertiary" (
    "id" BIGSERIAL NOT NULL,
    "leagueinfo_id" BIGINT NOT NULL,
    "states_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_leagueinfo_key_markets_tertiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_marketing_platforms_primary" (
    "id" BIGSERIAL NOT NULL,
    "leagueinfo_id" BIGINT NOT NULL,
    "marketingplatform_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_leagueinfo_marketing_platforms_primary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_marketing_platforms_secondary" (
    "id" BIGSERIAL NOT NULL,
    "leagueinfo_id" BIGINT NOT NULL,
    "marketingplatform_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_leagueinfo_marketing_platforms_secondary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_owner" (
    "id" BIGSERIAL NOT NULL,
    "leagueinfo_id" BIGINT NOT NULL,
    "leagueowner_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_leagueinfo_owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_personality_traits" (
    "id" BIGSERIAL NOT NULL,
    "leagueinfo_id" BIGINT NOT NULL,
    "subpersonality_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_leagueinfo_personality_traits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_taglines" (
    "id" BIGSERIAL NOT NULL,
    "leagueinfo_id" BIGINT NOT NULL,
    "taglines_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_leagueinfo_taglines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueinfo_tier" (
    "id" BIGSERIAL NOT NULL,
    "leagueinfo_id" BIGINT NOT NULL,
    "tier_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_leagueinfo_tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_leagueowner" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_leagueowner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_level" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_mainpersonality" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "modified_by_id" BIGINT,

    CONSTRAINT "dashapp_mainpersonality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_marketingplatform" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "modified_by_id" BIGINT,
    "modified_date" TIMESTAMP(6) NOT NULL,
    "created_by" VARCHAR(60),
    "platform" VARCHAR(20) NOT NULL,

    CONSTRAINT "dashapp_marketingplatform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_ottpartner" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_ottpartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_parentorg" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_parentorg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_partner" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_property" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_sport" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_sport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_sportsdealsummary" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "type" VARCHAR(32) NOT NULL,
    "status" VARCHAR(32),
    "commencement_date" VARCHAR(32),
    "expiration_date" VARCHAR(32),
    "duration" VARCHAR(32),
    "annual_value" DECIMAL,
    "total_value" DECIMAL,
    "territory" VARCHAR(32),
    "brand_id" BIGINT,
    "league_id" BIGINT,
    "level_id" BIGINT,
    "modified_by_id" BIGINT,
    "team_id" BIGINT,
    "athlete_id" BIGINT,
    "media_link" VARCHAR(512),

    CONSTRAINT "dashapp_sportsdealsummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_states" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "modified_by_id" BIGINT,
    "modified_date" TIMESTAMP(6) NOT NULL,
    "created_by" VARCHAR(60),
    "state" VARCHAR(50) NOT NULL,

    CONSTRAINT "dashapp_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_subpersonality" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "main_personality_id" BIGINT NOT NULL,
    "modified_by_id" BIGINT,

    CONSTRAINT "dashapp_subpersonality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_taglines" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_taglines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "team_name" VARCHAR(512) NOT NULL,
    "year_of_inception" VARCHAR(512),
    "franchise_fee" DECIMAL,
    "hq_state" VARCHAR(50),
    "instagram" VARCHAR(512),
    "facebook" VARCHAR(512),
    "twitter" VARCHAR(512),
    "linkedin" VARCHAR(512),
    "website" VARCHAR(512),
    "strategy_overview" TEXT,
    "hq_city_id" BIGINT,
    "league_id" BIGINT,
    "modified_by_id" BIGINT,
    "sport_id" BIGINT,
    "budget_range_from" DOUBLE PRECISION,
    "budget_range_to" DOUBLE PRECISION,
    "youtube" VARCHAR(512),

    CONSTRAINT "dashapp_team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team_active_campaigns" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "activecampaigns_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_team_active_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team_age" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "age_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_team_age_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team_gender" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "gender_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_team_gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team_income" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "income_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_team_income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team_key_markets_primary" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "keymarket_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_team_key_markets_primary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team_key_markets_secondary" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "keymarket_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_team_key_markets_secondary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team_key_markets_tertiary" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "states_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_team_key_markets_tertiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team_marketing_platforms_primary" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "marketingplatform_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_team_marketing_platforms_primary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team_marketing_platforms_secondary" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "marketingplatform_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_team_marketing_platforms_secondary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team_owner" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "teamowner_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_team_owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team_personality_traits" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "subpersonality_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_team_personality_traits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team_taglines" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "taglines_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_team_taglines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_team_tier" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "tier_id" BIGINT NOT NULL,

    CONSTRAINT "dashapp_team_tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_teamcontact" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "contact_name" VARCHAR(512) NOT NULL,
    "contact_designation" VARCHAR(512),
    "contact_email" VARCHAR(512),
    "contact_linkedin" VARCHAR(512),
    "modified_by_id" BIGINT,
    "team_id" BIGINT NOT NULL,
    "contact_no" VARCHAR(512),

    CONSTRAINT "dashapp_teamcontact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_teamendorsements" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "modified_by_id" BIGINT,
    "team_id" BIGINT NOT NULL,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_teamendorsements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_teamowner" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_teamowner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_territory" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "modified_by_id" BIGINT,
    "name" VARCHAR(512) NOT NULL,

    CONSTRAINT "dashapp_territory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_tier" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(6),
    "created_by" VARCHAR(60),
    "modified_date" TIMESTAMP(6) NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "modified_by_id" BIGINT,

    CONSTRAINT "dashapp_tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "django_admin_log" (
    "id" BIGSERIAL NOT NULL,
    "object_id" TEXT,
    "object_repr" VARCHAR(200) NOT NULL,
    "action_flag" BIGINT NOT NULL,
    "change_message" TEXT NOT NULL,
    "content_type_id" BIGINT,
    "user_id" BIGINT NOT NULL,
    "action_time" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "django_admin_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "django_content_type" (
    "id" BIGSERIAL NOT NULL,
    "app_label" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,

    CONSTRAINT "django_content_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "django_migrations" (
    "id" BIGSERIAL NOT NULL,
    "app" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "applied" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "django_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "django_session" (
    "session_key" VARCHAR(40) NOT NULL,
    "session_data" TEXT NOT NULL,
    "expire_date" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "django_session_pkey" PRIMARY KEY ("session_key")
);

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_auth_group_1" ON "auth_group"("name");

-- CreateIndex
CREATE INDEX "auth_group_permissions_group_id_b120cbf9" ON "auth_group_permissions"("group_id");

-- CreateIndex
CREATE INDEX "auth_group_permissions_permission_id_84c5c92e" ON "auth_group_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_group_permissions_group_id_permission_id_0cd325b0_uniq" ON "auth_group_permissions"("group_id", "permission_id");

-- CreateIndex
CREATE INDEX "auth_permission_content_type_id_2f476e4b" ON "auth_permission"("content_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_permission_content_type_id_codename_01ab375a_uniq" ON "auth_permission"("content_type_id", "codename");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_auth_user_1" ON "auth_user"("username");

-- CreateIndex
CREATE INDEX "auth_user_groups_group_id_97559544" ON "auth_user_groups"("group_id");

-- CreateIndex
CREATE INDEX "auth_user_groups_user_id_6a12ed8b" ON "auth_user_groups"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_groups_user_id_group_id_94350c0c_uniq" ON "auth_user_groups"("user_id", "group_id");

-- CreateIndex
CREATE INDEX "auth_user_user_permissions_permission_id_1fbb5f2c" ON "auth_user_user_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "auth_user_user_permissions_user_id_a95ead1b" ON "auth_user_user_permissions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_user_permissions_user_id_permission_id_14a6b632_uniq" ON "auth_user_user_permissions"("user_id", "permission_id");

-- CreateIndex
CREATE INDEX "dashapp_activation_athlete_id_5a5f74c2" ON "dashapp_activation"("athlete_id");

-- CreateIndex
CREATE INDEX "dashapp_activation_brand_id_26863c7c" ON "dashapp_activation"("brand_id");

-- CreateIndex
CREATE INDEX "dashapp_activation_league_id_6b397a79" ON "dashapp_activation"("league_id");

-- CreateIndex
CREATE INDEX "dashapp_activation_modified_by_id_52c3a3ed" ON "dashapp_activation"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_activation_team_id_f8d6b1c1" ON "dashapp_activation"("team_id");

-- CreateIndex
CREATE INDEX "dashapp_activation_assets_activation_id_5f5822b4" ON "dashapp_activation_assets"("activation_id");

-- CreateIndex
CREATE INDEX "dashapp_activation_assets_assets_id_89474167" ON "dashapp_activation_assets"("assets_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_activation_assets_activation_id_assets_id_ff1b90e4_uniq" ON "dashapp_activation_assets"("activation_id", "assets_id");

-- CreateIndex
CREATE INDEX "dashapp_activation_market_activation_id_96b431ca" ON "dashapp_activation_market"("activation_id");

-- CreateIndex
CREATE INDEX "dashapp_activation_market_states_id_c9a25e38" ON "dashapp_activation_market"("states_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_activation_market_activation_id_states_id_183f6a91_uniq" ON "dashapp_activation_market"("activation_id", "states_id");

-- CreateIndex
CREATE INDEX "dashapp_activation_property_activation_id_450c90ea" ON "dashapp_activation_property"("activation_id");

-- CreateIndex
CREATE INDEX "dashapp_activation_property_property_id_4ed0ce2c" ON "dashapp_activation_property"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_activation_property_activation_id_property_id_6abe3c06_" ON "dashapp_activation_property"("activation_id", "property_id");

-- CreateIndex
CREATE INDEX "dashapp_activation_type_activation_id_d2793893" ON "dashapp_activation_type"("activation_id");

-- CreateIndex
CREATE INDEX "dashapp_activation_type_marketingplatform_id_3e643438" ON "dashapp_activation_type"("marketingplatform_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_activation_type_activation_id_marketingplatform_id_7158" ON "dashapp_activation_type"("activation_id", "marketingplatform_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_activecampaigns_1" ON "dashapp_activecampaigns"("name");

-- CreateIndex
CREATE INDEX "dashapp_activecampaigns_modified_by_id_930ea06a" ON "dashapp_activecampaigns"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_age_1" ON "dashapp_age"("age_range");

-- CreateIndex
CREATE INDEX "dashapp_age_modified_by_id_67fff9b6" ON "dashapp_age"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_agency_1" ON "dashapp_agency"("name");

-- CreateIndex
CREATE INDEX "dashapp_agency_modified_by_id_c3305979" ON "dashapp_agency"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_assets_1" ON "dashapp_assets"("name");

-- CreateIndex
CREATE INDEX "dashapp_assets_modified_by_id_3abba2bb" ON "dashapp_assets"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_athlete_1" ON "dashapp_athlete"("athlete_name");

-- CreateIndex
CREATE INDEX "dashapp_athlete_agency_id_50deebaa" ON "dashapp_athlete"("agency_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_modified_by_id_b04f0216" ON "dashapp_athlete"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_sport_id_13503f1a" ON "dashapp_athlete"("sport_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_key_markets_primary_athlete_id_39a1bc17" ON "dashapp_athlete_key_markets_primary"("athlete_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_key_markets_primary_keymarket_id_77070ac9" ON "dashapp_athlete_key_markets_primary"("keymarket_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_athlete_key_markets_primary_athlete_id_keymarket_id_ebe" ON "dashapp_athlete_key_markets_primary"("athlete_id", "keymarket_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_key_markets_secondary_athlete_id_bb75669e" ON "dashapp_athlete_key_markets_secondary"("athlete_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_key_markets_secondary_keymarket_id_f7b8a65a" ON "dashapp_athlete_key_markets_secondary"("keymarket_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_athlete_key_markets_secondary_athlete_id_keymarket_id_3" ON "dashapp_athlete_key_markets_secondary"("athlete_id", "keymarket_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_key_markets_tertiary_athlete_id_e8f9eed5" ON "dashapp_athlete_key_markets_tertiary"("athlete_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_key_markets_tertiary_states_id_c21ea1df" ON "dashapp_athlete_key_markets_tertiary"("states_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_athlete_key_markets_tertiary_athlete_id_states_id_5897b" ON "dashapp_athlete_key_markets_tertiary"("athlete_id", "states_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_personality_traits_athlete_id_d34493e8" ON "dashapp_athlete_personality_traits"("athlete_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_personality_traits_subpersonality_id_c37bb5f7" ON "dashapp_athlete_personality_traits"("subpersonality_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_athlete_personality_traits_athlete_id_subpersonality_id" ON "dashapp_athlete_personality_traits"("athlete_id", "subpersonality_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_target_age_age_id_4d0557f9" ON "dashapp_athlete_target_age"("age_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_target_age_athlete_id_497ae0ee" ON "dashapp_athlete_target_age"("athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_athlete_target_age_athlete_id_age_id_6741741d_uniq" ON "dashapp_athlete_target_age"("athlete_id", "age_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_target_gender_athlete_id_60bdaf8a" ON "dashapp_athlete_target_gender"("athlete_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_target_gender_gender_id_59eda92c" ON "dashapp_athlete_target_gender"("gender_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_athlete_target_gender_athlete_id_gender_id_0ac4a7ed_uni" ON "dashapp_athlete_target_gender"("athlete_id", "gender_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_target_income_athlete_id_45c8a20b" ON "dashapp_athlete_target_income"("athlete_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_target_income_income_id_ba5891e2" ON "dashapp_athlete_target_income"("income_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_athlete_target_income_athlete_id_income_id_2bdbc731_uni" ON "dashapp_athlete_target_income"("athlete_id", "income_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_tier_athlete_id_b973a60b" ON "dashapp_athlete_tier"("athlete_id");

-- CreateIndex
CREATE INDEX "dashapp_athlete_tier_tier_id_9c930277" ON "dashapp_athlete_tier"("tier_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_athlete_tier_athlete_id_tier_id_d69bb0ef_uniq" ON "dashapp_athlete_tier"("athlete_id", "tier_id");

-- CreateIndex
CREATE INDEX "dashapp_athletecontact_athlete_id_c485301c" ON "dashapp_athletecontact"("athlete_id");

-- CreateIndex
CREATE INDEX "dashapp_athletecontact_modified_by_id_afaebd01" ON "dashapp_athletecontact"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_brandcontact_brand_id_d4afec00" ON "dashapp_brandcontact"("brand_id");

-- CreateIndex
CREATE INDEX "dashapp_brandcontact_modified_by_id_dc0cf81f" ON "dashapp_brandcontact"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_brandendorsements_1" ON "dashapp_brandendorsements"("name");

-- CreateIndex
CREATE INDEX "dashapp_brandendorsements_brand_id_f296ce5e" ON "dashapp_brandendorsements"("brand_id");

-- CreateIndex
CREATE INDEX "dashapp_brandendorsements_modified_by_id_6736e850" ON "dashapp_brandendorsements"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_broadcastpartner_1" ON "dashapp_broadcastpartner"("name");

-- CreateIndex
CREATE INDEX "dashapp_broadcastpartner_modified_by_id_55432538" ON "dashapp_broadcastpartner"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_category_1" ON "dashapp_category"("name");

-- CreateIndex
CREATE INDEX "dashapp_category_modified_by_id_b813aa82" ON "dashapp_category"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_companydata_1" ON "dashapp_companydata"("company_name");

-- CreateIndex
CREATE INDEX "dashapp_companydata_agency_id_095c43b0" ON "dashapp_companydata"("agency_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_category_id_84d9e9fb" ON "dashapp_companydata"("category_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_hq_city_id_f599445d" ON "dashapp_companydata"("hq_city_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_modified_by_id_91329cae" ON "dashapp_companydata"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_parent_organization_id_c6c032d1" ON "dashapp_companydata"("parent_organization_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_active_campaigns_activecampaigns_id_a64ecbc" ON "dashapp_companydata_active_campaigns"("activecampaigns_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_active_campaigns_companydata_id_ae7b779c" ON "dashapp_companydata_active_campaigns"("companydata_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_companydata_active_campaigns_companydata_id_activecampa" ON "dashapp_companydata_active_campaigns"("companydata_id", "activecampaigns_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_age_age_id_41fb647f" ON "dashapp_companydata_age"("age_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_age_companydata_id_64cad252" ON "dashapp_companydata_age"("companydata_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_companydata_age_companydata_id_age_id_bc1a8f03_uniq" ON "dashapp_companydata_age"("companydata_id", "age_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_gender_companydata_id_6ebe168f" ON "dashapp_companydata_gender"("companydata_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_gender_gender_id_f5eed386" ON "dashapp_companydata_gender"("gender_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_companydata_gender_companydata_id_gender_id_715dcfe1_un" ON "dashapp_companydata_gender"("companydata_id", "gender_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_income_companydata_id_87e1704b" ON "dashapp_companydata_income"("companydata_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_income_income_id_d24f4e03" ON "dashapp_companydata_income"("income_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_companydata_income_companydata_id_income_id_7777bde5_un" ON "dashapp_companydata_income"("companydata_id", "income_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_key_markets_primary_companydata_id_5fd95e99" ON "dashapp_companydata_key_markets_primary"("companydata_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_key_markets_primary_keymarket_id_7756c025" ON "dashapp_companydata_key_markets_primary"("keymarket_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_companydata_key_markets_primary_companydata_id_keymarke" ON "dashapp_companydata_key_markets_primary"("companydata_id", "keymarket_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_key_markets_secondary_companydata_id_736cfc" ON "dashapp_companydata_key_markets_secondary"("companydata_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_key_markets_secondary_keymarket_id_d2d6e9b5" ON "dashapp_companydata_key_markets_secondary"("keymarket_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_companydata_key_markets_secondary_companydata_id_keymar" ON "dashapp_companydata_key_markets_secondary"("companydata_id", "keymarket_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_key_markets_tertiary_companydata_id_484aaa6" ON "dashapp_companydata_key_markets_tertiary"("companydata_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_key_markets_tertiary_states_id_dcb29fc6" ON "dashapp_companydata_key_markets_tertiary"("states_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_companydata_key_markets_tertiary_companydata_id_states_" ON "dashapp_companydata_key_markets_tertiary"("companydata_id", "states_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_marketing_platforms_primary_companydata_id_" ON "dashapp_companydata_marketing_platforms_primary"("companydata_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_marketing_platforms_primary_marketingplatfo" ON "dashapp_companydata_marketing_platforms_primary"("marketingplatform_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_marketing_platforms_secondary_companydata_i" ON "dashapp_companydata_marketing_platforms_secondary"("companydata_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_marketing_platforms_secondary_marketingplat" ON "dashapp_companydata_marketing_platforms_secondary"("marketingplatform_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_personality_traits_companydata_id_7c3c6376" ON "dashapp_companydata_personality_traits"("companydata_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_personality_traits_subpersonality_id_38b67e" ON "dashapp_companydata_personality_traits"("subpersonality_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_companydata_personality_traits_companydata_id_subperson" ON "dashapp_companydata_personality_traits"("companydata_id", "subpersonality_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_taglines_companydata_id_b85e58cf" ON "dashapp_companydata_taglines"("companydata_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_taglines_taglines_id_ceab6876" ON "dashapp_companydata_taglines"("taglines_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_companydata_taglines_companydata_id_taglines_id_5fce5fc" ON "dashapp_companydata_taglines"("companydata_id", "taglines_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_tier_companydata_id_fb5ce29c" ON "dashapp_companydata_tier"("companydata_id");

-- CreateIndex
CREATE INDEX "dashapp_companydata_tier_tier_id_d1edd952" ON "dashapp_companydata_tier"("tier_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_companydata_tier_companydata_id_tier_id_bb150350_uniq" ON "dashapp_companydata_tier"("companydata_id", "tier_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_gender_1" ON "dashapp_gender"("gender_is");

-- CreateIndex
CREATE INDEX "dashapp_gender_modified_by_id_c30eb1f4" ON "dashapp_gender"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_hqcity_1" ON "dashapp_hqcity"("name");

-- CreateIndex
CREATE INDEX "dashapp_hqcity_modified_by_id_ba6f7792" ON "dashapp_hqcity"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_income_1" ON "dashapp_income"("income_class");

-- CreateIndex
CREATE INDEX "dashapp_income_modified_by_id_a4631d6c" ON "dashapp_income"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_keymarket_1" ON "dashapp_keymarket"("zone");

-- CreateIndex
CREATE INDEX "dashapp_keymarket_modified_by_id_3fd84f5b" ON "dashapp_keymarket"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_league_1" ON "dashapp_league"("name");

-- CreateIndex
CREATE INDEX "dashapp_league_modified_by_id_e0e124d6" ON "dashapp_league"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_leaguecontact_league_id_ee666bcd" ON "dashapp_leaguecontact"("league_id");

-- CreateIndex
CREATE INDEX "dashapp_leaguecontact_modified_by_id_d0d16056" ON "dashapp_leaguecontact"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_leagueendorsements_1" ON "dashapp_leagueendorsements"("name");

-- CreateIndex
CREATE INDEX "dashapp_leagueendorsements_league_id_246ed7cc" ON "dashapp_leagueendorsements"("league_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueendorsements_modified_by_id_0364d90e" ON "dashapp_leagueendorsements"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_leagueinfo_1" ON "dashapp_leagueinfo"("property_name");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_brodcast_partner_id_40f27555" ON "dashapp_leagueinfo"("brodcast_partner_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_modified_by_id_d356e033" ON "dashapp_leagueinfo"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_ott_partner_id_8e1cbaf6" ON "dashapp_leagueinfo"("ott_partner_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_sport_id_8e48e5cd" ON "dashapp_leagueinfo"("sport_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_active_campaigns_activecampaigns_id_f6081957" ON "dashapp_leagueinfo_active_campaigns"("activecampaigns_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_active_campaigns_leagueinfo_id_cfd03ed5" ON "dashapp_leagueinfo_active_campaigns"("leagueinfo_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_active_campaigns_leagueinfo_id_activecampaig" ON "dashapp_leagueinfo_active_campaigns"("leagueinfo_id", "activecampaigns_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_age_age_id_29563f08" ON "dashapp_leagueinfo_age"("age_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_age_leagueinfo_id_6fa66a9a" ON "dashapp_leagueinfo_age"("leagueinfo_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_age_leagueinfo_id_age_id_0cf79630_uniq" ON "dashapp_leagueinfo_age"("leagueinfo_id", "age_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_gender_gender_id_1d1defcd" ON "dashapp_leagueinfo_gender"("gender_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_gender_leagueinfo_id_0aa33e31" ON "dashapp_leagueinfo_gender"("leagueinfo_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_gender_leagueinfo_id_gender_id_117785c3_uniq" ON "dashapp_leagueinfo_gender"("leagueinfo_id", "gender_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_income_income_id_96258983" ON "dashapp_leagueinfo_income"("income_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_income_leagueinfo_id_71484152" ON "dashapp_leagueinfo_income"("leagueinfo_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_income_leagueinfo_id_income_id_b79c2469_uniq" ON "dashapp_leagueinfo_income"("leagueinfo_id", "income_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_key_markets_primary_keymarket_id_b6ff4ccd" ON "dashapp_leagueinfo_key_markets_primary"("keymarket_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_key_markets_primary_leagueinfo_id_d1225e78" ON "dashapp_leagueinfo_key_markets_primary"("leagueinfo_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_key_markets_primary_leagueinfo_id_keymarket_" ON "dashapp_leagueinfo_key_markets_primary"("leagueinfo_id", "keymarket_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_key_markets_secondary_keymarket_id_240da023" ON "dashapp_leagueinfo_key_markets_secondary"("keymarket_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_key_markets_secondary_leagueinfo_id_58ffc735" ON "dashapp_leagueinfo_key_markets_secondary"("leagueinfo_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_key_markets_secondary_leagueinfo_id_keymarke" ON "dashapp_leagueinfo_key_markets_secondary"("leagueinfo_id", "keymarket_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_key_markets_tertiary_leagueinfo_id_0b4e2add" ON "dashapp_leagueinfo_key_markets_tertiary"("leagueinfo_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_key_markets_tertiary_states_id_151c6068" ON "dashapp_leagueinfo_key_markets_tertiary"("states_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_key_markets_tertiary_leagueinfo_id_states_id" ON "dashapp_leagueinfo_key_markets_tertiary"("leagueinfo_id", "states_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_marketing_platforms_primary_leagueinfo_id_7c" ON "dashapp_leagueinfo_marketing_platforms_primary"("leagueinfo_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_marketing_platforms_primary_marketingplatfor" ON "dashapp_leagueinfo_marketing_platforms_primary"("marketingplatform_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_marketing_platforms_primary_leagueinfo_id_ma" ON "dashapp_leagueinfo_marketing_platforms_primary"("leagueinfo_id", "marketingplatform_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_marketing_platforms_secondary_leagueinfo_id_" ON "dashapp_leagueinfo_marketing_platforms_secondary"("leagueinfo_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_marketing_platforms_secondary_marketingplatf" ON "dashapp_leagueinfo_marketing_platforms_secondary"("marketingplatform_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_owner_leagueinfo_id_dee74541" ON "dashapp_leagueinfo_owner"("leagueinfo_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_owner_leagueowner_id_2554f991" ON "dashapp_leagueinfo_owner"("leagueowner_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_owner_leagueinfo_id_leagueowner_id_fbe00462_" ON "dashapp_leagueinfo_owner"("leagueinfo_id", "leagueowner_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_personality_traits_leagueinfo_id_c36afc9e" ON "dashapp_leagueinfo_personality_traits"("leagueinfo_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_personality_traits_subpersonality_id_1587eaa" ON "dashapp_leagueinfo_personality_traits"("subpersonality_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_personality_traits_leagueinfo_id_subpersonal" ON "dashapp_leagueinfo_personality_traits"("leagueinfo_id", "subpersonality_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_taglines_leagueinfo_id_934f1967" ON "dashapp_leagueinfo_taglines"("leagueinfo_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_taglines_taglines_id_edd75c38" ON "dashapp_leagueinfo_taglines"("taglines_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_taglines_leagueinfo_id_taglines_id_0f20f5ca_" ON "dashapp_leagueinfo_taglines"("leagueinfo_id", "taglines_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_tier_leagueinfo_id_0e1fa959" ON "dashapp_leagueinfo_tier"("leagueinfo_id");

-- CreateIndex
CREATE INDEX "dashapp_leagueinfo_tier_tier_id_fed81805" ON "dashapp_leagueinfo_tier"("tier_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_leagueinfo_tier_leagueinfo_id_tier_id_f1cc24bc_uniq" ON "dashapp_leagueinfo_tier"("leagueinfo_id", "tier_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_leagueowner_1" ON "dashapp_leagueowner"("name");

-- CreateIndex
CREATE INDEX "dashapp_leagueowner_modified_by_id_e8fe8f6e" ON "dashapp_leagueowner"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_level_1" ON "dashapp_level"("name");

-- CreateIndex
CREATE INDEX "dashapp_level_modified_by_id_76ee0cb5" ON "dashapp_level"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_mainpersonality_modified_by_id_431bf4a5" ON "dashapp_mainpersonality"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_marketingplatform_1" ON "dashapp_marketingplatform"("platform");

-- CreateIndex
CREATE INDEX "dashapp_marketingplatform_modified_by_id_6236b8b5" ON "dashapp_marketingplatform"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_ottpartner_1" ON "dashapp_ottpartner"("name");

-- CreateIndex
CREATE INDEX "dashapp_ottpartner_modified_by_id_8e9a4877" ON "dashapp_ottpartner"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_parentorg_1" ON "dashapp_parentorg"("name");

-- CreateIndex
CREATE INDEX "dashapp_parentorg_modified_by_id_6ffc2f7f" ON "dashapp_parentorg"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_partner_1" ON "dashapp_partner"("name");

-- CreateIndex
CREATE INDEX "dashapp_partner_modified_by_id_56622e99" ON "dashapp_partner"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_property_1" ON "dashapp_property"("name");

-- CreateIndex
CREATE INDEX "dashapp_property_modified_by_id_159f6568" ON "dashapp_property"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_sport_1" ON "dashapp_sport"("name");

-- CreateIndex
CREATE INDEX "dashapp_sport_modified_by_id_48a645cc" ON "dashapp_sport"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_sportsdealsummary_athlete_id_0b3f96ad" ON "dashapp_sportsdealsummary"("athlete_id");

-- CreateIndex
CREATE INDEX "dashapp_sportsdealsummary_brand_id_8f2c9d3f" ON "dashapp_sportsdealsummary"("brand_id");

-- CreateIndex
CREATE INDEX "dashapp_sportsdealsummary_league_id_3b81f0e1" ON "dashapp_sportsdealsummary"("league_id");

-- CreateIndex
CREATE INDEX "dashapp_sportsdealsummary_level_id_37c970ab" ON "dashapp_sportsdealsummary"("level_id");

-- CreateIndex
CREATE INDEX "dashapp_sportsdealsummary_modified_by_id_ac4739a8" ON "dashapp_sportsdealsummary"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_sportsdealsummary_team_id_197e50ed" ON "dashapp_sportsdealsummary"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_states_1" ON "dashapp_states"("state");

-- CreateIndex
CREATE INDEX "dashapp_states_modified_by_id_3acf32e3" ON "dashapp_states"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_subpersonality_main_personality_id_2905ff96" ON "dashapp_subpersonality"("main_personality_id");

-- CreateIndex
CREATE INDEX "dashapp_subpersonality_modified_by_id_13e7170d" ON "dashapp_subpersonality"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_taglines_1" ON "dashapp_taglines"("name");

-- CreateIndex
CREATE INDEX "dashapp_taglines_modified_by_id_4854394b" ON "dashapp_taglines"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_team_1" ON "dashapp_team"("team_name");

-- CreateIndex
CREATE INDEX "dashapp_team_hq_city_id_fa8703dd" ON "dashapp_team"("hq_city_id");

-- CreateIndex
CREATE INDEX "dashapp_team_league_id_30ad02cd" ON "dashapp_team"("league_id");

-- CreateIndex
CREATE INDEX "dashapp_team_modified_by_id_a08635ef" ON "dashapp_team"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_team_sport_id_a02a07a2" ON "dashapp_team"("sport_id");

-- CreateIndex
CREATE INDEX "dashapp_team_active_campaigns_activecampaigns_id_ee36c5cf" ON "dashapp_team_active_campaigns"("activecampaigns_id");

-- CreateIndex
CREATE INDEX "dashapp_team_active_campaigns_team_id_444427ca" ON "dashapp_team_active_campaigns"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_active_campaigns_team_id_activecampaigns_id_096c7c" ON "dashapp_team_active_campaigns"("team_id", "activecampaigns_id");

-- CreateIndex
CREATE INDEX "dashapp_team_age_age_id_93e7aee9" ON "dashapp_team_age"("age_id");

-- CreateIndex
CREATE INDEX "dashapp_team_age_team_id_b1ffa160" ON "dashapp_team_age"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_age_team_id_age_id_77b469fe_uniq" ON "dashapp_team_age"("team_id", "age_id");

-- CreateIndex
CREATE INDEX "dashapp_team_gender_gender_id_00d7641b" ON "dashapp_team_gender"("gender_id");

-- CreateIndex
CREATE INDEX "dashapp_team_gender_team_id_4fc23827" ON "dashapp_team_gender"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_gender_team_id_gender_id_35e8bfa1_uniq" ON "dashapp_team_gender"("team_id", "gender_id");

-- CreateIndex
CREATE INDEX "dashapp_team_income_income_id_97e882f6" ON "dashapp_team_income"("income_id");

-- CreateIndex
CREATE INDEX "dashapp_team_income_team_id_69f02667" ON "dashapp_team_income"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_income_team_id_income_id_418b4c9b_uniq" ON "dashapp_team_income"("team_id", "income_id");

-- CreateIndex
CREATE INDEX "dashapp_team_key_markets_primary_keymarket_id_e2bad1fc" ON "dashapp_team_key_markets_primary"("keymarket_id");

-- CreateIndex
CREATE INDEX "dashapp_team_key_markets_primary_team_id_b23227d4" ON "dashapp_team_key_markets_primary"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_key_markets_primary_team_id_keymarket_id_de4c5e26_" ON "dashapp_team_key_markets_primary"("team_id", "keymarket_id");

-- CreateIndex
CREATE INDEX "dashapp_team_key_markets_secondary_keymarket_id_8bcf6950" ON "dashapp_team_key_markets_secondary"("keymarket_id");

-- CreateIndex
CREATE INDEX "dashapp_team_key_markets_secondary_team_id_97fb0ff4" ON "dashapp_team_key_markets_secondary"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_key_markets_secondary_team_id_keymarket_id_a4b4bb5" ON "dashapp_team_key_markets_secondary"("team_id", "keymarket_id");

-- CreateIndex
CREATE INDEX "dashapp_team_key_markets_tertiary_states_id_4263ea76" ON "dashapp_team_key_markets_tertiary"("states_id");

-- CreateIndex
CREATE INDEX "dashapp_team_key_markets_tertiary_team_id_2e1025e5" ON "dashapp_team_key_markets_tertiary"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_key_markets_tertiary_team_id_states_id_4eca64f1_un" ON "dashapp_team_key_markets_tertiary"("team_id", "states_id");

-- CreateIndex
CREATE INDEX "dashapp_team_marketing_platforms_primary_marketingplatform_id_a" ON "dashapp_team_marketing_platforms_primary"("marketingplatform_id");

-- CreateIndex
CREATE INDEX "dashapp_team_marketing_platforms_primary_team_id_bcf289cf" ON "dashapp_team_marketing_platforms_primary"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_marketing_platforms_primary_team_id_marketingplatf" ON "dashapp_team_marketing_platforms_primary"("team_id", "marketingplatform_id");

-- CreateIndex
CREATE INDEX "dashapp_team_marketing_platforms_secondary_marketingplatform_id" ON "dashapp_team_marketing_platforms_secondary"("marketingplatform_id");

-- CreateIndex
CREATE INDEX "dashapp_team_marketing_platforms_secondary_team_id_27163191" ON "dashapp_team_marketing_platforms_secondary"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_marketing_platforms_secondary_team_id_marketingpla" ON "dashapp_team_marketing_platforms_secondary"("team_id", "marketingplatform_id");

-- CreateIndex
CREATE INDEX "dashapp_team_owner_team_id_a6cb880b" ON "dashapp_team_owner"("team_id");

-- CreateIndex
CREATE INDEX "dashapp_team_owner_teamowner_id_5e0c237c" ON "dashapp_team_owner"("teamowner_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_owner_team_id_teamowner_id_a9f50b7f_uniq" ON "dashapp_team_owner"("team_id", "teamowner_id");

-- CreateIndex
CREATE INDEX "dashapp_team_personality_traits_subpersonality_id_b3ad5333" ON "dashapp_team_personality_traits"("subpersonality_id");

-- CreateIndex
CREATE INDEX "dashapp_team_personality_traits_team_id_693f77e3" ON "dashapp_team_personality_traits"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_personality_traits_team_id_subpersonality_id_14dd1" ON "dashapp_team_personality_traits"("team_id", "subpersonality_id");

-- CreateIndex
CREATE INDEX "dashapp_team_taglines_taglines_id_a09072e9" ON "dashapp_team_taglines"("taglines_id");

-- CreateIndex
CREATE INDEX "dashapp_team_taglines_team_id_34ebae82" ON "dashapp_team_taglines"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_taglines_team_id_taglines_id_34dfb3e8_uniq" ON "dashapp_team_taglines"("team_id", "taglines_id");

-- CreateIndex
CREATE INDEX "dashapp_team_tier_team_id_ee72e812" ON "dashapp_team_tier"("team_id");

-- CreateIndex
CREATE INDEX "dashapp_team_tier_tier_id_f9d64076" ON "dashapp_team_tier"("tier_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_team_tier_team_id_tier_id_2978b40f_uniq" ON "dashapp_team_tier"("team_id", "tier_id");

-- CreateIndex
CREATE INDEX "dashapp_teamcontact_modified_by_id_a74039ab" ON "dashapp_teamcontact"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_teamcontact_team_id_12a62efe" ON "dashapp_teamcontact"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_teamendorsements_1" ON "dashapp_teamendorsements"("name");

-- CreateIndex
CREATE INDEX "dashapp_teamendorsements_modified_by_id_6a821591" ON "dashapp_teamendorsements"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_teamendorsements_team_id_3a1dec2d" ON "dashapp_teamendorsements"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_teamowner_1" ON "dashapp_teamowner"("name");

-- CreateIndex
CREATE INDEX "dashapp_teamowner_modified_by_id_0a1a1b30" ON "dashapp_teamowner"("modified_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_territory_1" ON "dashapp_territory"("name");

-- CreateIndex
CREATE INDEX "dashapp_territory_modified_by_id_36ab1fe8" ON "dashapp_territory"("modified_by_id");

-- CreateIndex
CREATE INDEX "dashapp_tier_modified_by_id_cafe9708" ON "dashapp_tier"("modified_by_id");

-- CreateIndex
CREATE INDEX "django_admin_log_content_type_id_c4bce8eb" ON "django_admin_log"("content_type_id");

-- CreateIndex
CREATE INDEX "django_admin_log_user_id_c564eba6" ON "django_admin_log"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "django_content_type_app_label_model_76bd3d3b_uniq" ON "django_content_type"("app_label", "model");

-- CreateIndex
CREATE INDEX "django_session_expire_date_a5c62663" ON "django_session"("expire_date");

-- AddForeignKey
ALTER TABLE "auth_group_permissions" ADD CONSTRAINT "auth_group_permissions_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "auth_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_group_permissions" ADD CONSTRAINT "auth_group_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "auth_permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_permission" ADD CONSTRAINT "auth_permission_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "django_content_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_user_groups" ADD CONSTRAINT "auth_user_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "auth_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_user_groups" ADD CONSTRAINT "auth_user_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_user_user_permissions" ADD CONSTRAINT "auth_user_user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "auth_permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_user_user_permissions" ADD CONSTRAINT "auth_user_user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activation" ADD CONSTRAINT "dashapp_activation_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activation" ADD CONSTRAINT "dashapp_activation_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activation" ADD CONSTRAINT "dashapp_activation_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activation" ADD CONSTRAINT "dashapp_activation_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activation" ADD CONSTRAINT "dashapp_activation_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activation_assets" ADD CONSTRAINT "dashapp_activation_assets_activation_id_fkey" FOREIGN KEY ("activation_id") REFERENCES "dashapp_activation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activation_assets" ADD CONSTRAINT "dashapp_activation_assets_assets_id_fkey" FOREIGN KEY ("assets_id") REFERENCES "dashapp_assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activation_market" ADD CONSTRAINT "dashapp_activation_market_activation_id_fkey" FOREIGN KEY ("activation_id") REFERENCES "dashapp_activation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activation_market" ADD CONSTRAINT "dashapp_activation_market_states_id_fkey" FOREIGN KEY ("states_id") REFERENCES "dashapp_states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activation_property" ADD CONSTRAINT "dashapp_activation_property_activation_id_fkey" FOREIGN KEY ("activation_id") REFERENCES "dashapp_activation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activation_property" ADD CONSTRAINT "dashapp_activation_property_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "dashapp_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activation_type" ADD CONSTRAINT "dashapp_activation_type_activation_id_fkey" FOREIGN KEY ("activation_id") REFERENCES "dashapp_activation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activation_type" ADD CONSTRAINT "dashapp_activation_type_marketingplatform_id_fkey" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_activecampaigns" ADD CONSTRAINT "dashapp_activecampaigns_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_age" ADD CONSTRAINT "dashapp_age_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_agency" ADD CONSTRAINT "dashapp_agency_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_assets" ADD CONSTRAINT "dashapp_assets_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete" ADD CONSTRAINT "dashapp_athlete_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "dashapp_agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete" ADD CONSTRAINT "dashapp_athlete_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete" ADD CONSTRAINT "dashapp_athlete_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "dashapp_sport"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_key_markets_primary" ADD CONSTRAINT "dashapp_athlete_key_markets_primary_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_key_markets_primary" ADD CONSTRAINT "dashapp_athlete_key_markets_primary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_key_markets_secondary" ADD CONSTRAINT "dashapp_athlete_key_markets_secondary_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_key_markets_secondary" ADD CONSTRAINT "dashapp_athlete_key_markets_secondary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_key_markets_tertiary" ADD CONSTRAINT "dashapp_athlete_key_markets_tertiary_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_key_markets_tertiary" ADD CONSTRAINT "dashapp_athlete_key_markets_tertiary_states_id_fkey" FOREIGN KEY ("states_id") REFERENCES "dashapp_states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_personality_traits" ADD CONSTRAINT "dashapp_athlete_personality_traits_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_personality_traits" ADD CONSTRAINT "dashapp_athlete_personality_traits_subpersonality_id_fkey" FOREIGN KEY ("subpersonality_id") REFERENCES "dashapp_subpersonality"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_target_age" ADD CONSTRAINT "dashapp_athlete_target_age_age_id_fkey" FOREIGN KEY ("age_id") REFERENCES "dashapp_age"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_target_age" ADD CONSTRAINT "dashapp_athlete_target_age_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_target_gender" ADD CONSTRAINT "dashapp_athlete_target_gender_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_target_gender" ADD CONSTRAINT "dashapp_athlete_target_gender_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "dashapp_gender"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_target_income" ADD CONSTRAINT "dashapp_athlete_target_income_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_target_income" ADD CONSTRAINT "dashapp_athlete_target_income_income_id_fkey" FOREIGN KEY ("income_id") REFERENCES "dashapp_income"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_tier" ADD CONSTRAINT "dashapp_athlete_tier_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_tier" ADD CONSTRAINT "dashapp_athlete_tier_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "dashapp_tier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athletecontact" ADD CONSTRAINT "dashapp_athletecontact_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athletecontact" ADD CONSTRAINT "dashapp_athletecontact_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_brandcontact" ADD CONSTRAINT "dashapp_brandcontact_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_brandcontact" ADD CONSTRAINT "dashapp_brandcontact_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_brandendorsements" ADD CONSTRAINT "dashapp_brandendorsements_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_brandendorsements" ADD CONSTRAINT "dashapp_brandendorsements_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_broadcastpartner" ADD CONSTRAINT "dashapp_broadcastpartner_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_category" ADD CONSTRAINT "dashapp_category_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata" ADD CONSTRAINT "dashapp_companydata_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "dashapp_agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata" ADD CONSTRAINT "dashapp_companydata_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "dashapp_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata" ADD CONSTRAINT "dashapp_companydata_hq_city_id_fkey" FOREIGN KEY ("hq_city_id") REFERENCES "dashapp_hqcity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata" ADD CONSTRAINT "dashapp_companydata_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata" ADD CONSTRAINT "dashapp_companydata_parent_organization_id_fkey" FOREIGN KEY ("parent_organization_id") REFERENCES "dashapp_parentorg"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_active_campaigns" ADD CONSTRAINT "dashapp_companydata_active_campaigns_activecampaigns_id_fkey" FOREIGN KEY ("activecampaigns_id") REFERENCES "dashapp_activecampaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_active_campaigns" ADD CONSTRAINT "dashapp_companydata_active_campaigns_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_age" ADD CONSTRAINT "dashapp_companydata_age_age_id_fkey" FOREIGN KEY ("age_id") REFERENCES "dashapp_age"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_age" ADD CONSTRAINT "dashapp_companydata_age_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_gender" ADD CONSTRAINT "dashapp_companydata_gender_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_gender" ADD CONSTRAINT "dashapp_companydata_gender_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "dashapp_gender"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_income" ADD CONSTRAINT "dashapp_companydata_income_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_income" ADD CONSTRAINT "dashapp_companydata_income_income_id_fkey" FOREIGN KEY ("income_id") REFERENCES "dashapp_income"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_key_markets_primary" ADD CONSTRAINT "dashapp_companydata_key_markets_primary_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_key_markets_primary" ADD CONSTRAINT "dashapp_companydata_key_markets_primary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_key_markets_secondary" ADD CONSTRAINT "dashapp_companydata_key_markets_secondary_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_key_markets_secondary" ADD CONSTRAINT "dashapp_companydata_key_markets_secondary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_key_markets_tertiary" ADD CONSTRAINT "dashapp_companydata_key_markets_tertiary_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_key_markets_tertiary" ADD CONSTRAINT "dashapp_companydata_key_markets_tertiary_states_id_fkey" FOREIGN KEY ("states_id") REFERENCES "dashapp_states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_marketing_platforms_primary" ADD CONSTRAINT "dashapp_companydata_marketing_platfor_marketingplatform_id_fkey" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_marketing_platforms_primary" ADD CONSTRAINT "dashapp_companydata_marketing_platforms_pri_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_marketing_platforms_secondary" ADD CONSTRAINT "dashapp_companydata_marketing_platfo_marketingplatform_id_fkey1" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_marketing_platforms_secondary" ADD CONSTRAINT "dashapp_companydata_marketing_platforms_sec_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_personality_traits" ADD CONSTRAINT "dashapp_companydata_personality_traits_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_personality_traits" ADD CONSTRAINT "dashapp_companydata_personality_traits_subpersonality_id_fkey" FOREIGN KEY ("subpersonality_id") REFERENCES "dashapp_subpersonality"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_taglines" ADD CONSTRAINT "dashapp_companydata_taglines_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_taglines" ADD CONSTRAINT "dashapp_companydata_taglines_taglines_id_fkey" FOREIGN KEY ("taglines_id") REFERENCES "dashapp_taglines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_tier" ADD CONSTRAINT "dashapp_companydata_tier_companydata_id_fkey" FOREIGN KEY ("companydata_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_companydata_tier" ADD CONSTRAINT "dashapp_companydata_tier_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "dashapp_tier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_gender" ADD CONSTRAINT "dashapp_gender_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_hqcity" ADD CONSTRAINT "dashapp_hqcity_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_income" ADD CONSTRAINT "dashapp_income_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_keymarket" ADD CONSTRAINT "dashapp_keymarket_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_league" ADD CONSTRAINT "dashapp_league_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leaguecontact" ADD CONSTRAINT "dashapp_leaguecontact_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leaguecontact" ADD CONSTRAINT "dashapp_leaguecontact_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueendorsements" ADD CONSTRAINT "dashapp_leagueendorsements_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueendorsements" ADD CONSTRAINT "dashapp_leagueendorsements_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo" ADD CONSTRAINT "dashapp_leagueinfo_brodcast_partner_id_fkey" FOREIGN KEY ("brodcast_partner_id") REFERENCES "dashapp_broadcastpartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo" ADD CONSTRAINT "dashapp_leagueinfo_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo" ADD CONSTRAINT "dashapp_leagueinfo_ott_partner_id_fkey" FOREIGN KEY ("ott_partner_id") REFERENCES "dashapp_ottpartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo" ADD CONSTRAINT "dashapp_leagueinfo_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "dashapp_sport"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_active_campaigns" ADD CONSTRAINT "dashapp_leagueinfo_active_campaigns_activecampaigns_id_fkey" FOREIGN KEY ("activecampaigns_id") REFERENCES "dashapp_activecampaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_active_campaigns" ADD CONSTRAINT "dashapp_leagueinfo_active_campaigns_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_age" ADD CONSTRAINT "dashapp_leagueinfo_age_age_id_fkey" FOREIGN KEY ("age_id") REFERENCES "dashapp_age"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_age" ADD CONSTRAINT "dashapp_leagueinfo_age_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_gender" ADD CONSTRAINT "dashapp_leagueinfo_gender_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "dashapp_gender"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_gender" ADD CONSTRAINT "dashapp_leagueinfo_gender_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_income" ADD CONSTRAINT "dashapp_leagueinfo_income_income_id_fkey" FOREIGN KEY ("income_id") REFERENCES "dashapp_income"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_income" ADD CONSTRAINT "dashapp_leagueinfo_income_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_primary" ADD CONSTRAINT "dashapp_leagueinfo_key_markets_primary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_primary" ADD CONSTRAINT "dashapp_leagueinfo_key_markets_primary_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_secondary" ADD CONSTRAINT "dashapp_leagueinfo_key_markets_secondary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_secondary" ADD CONSTRAINT "dashapp_leagueinfo_key_markets_secondary_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_tertiary" ADD CONSTRAINT "dashapp_leagueinfo_key_markets_tertiary_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_key_markets_tertiary" ADD CONSTRAINT "dashapp_leagueinfo_key_markets_tertiary_states_id_fkey" FOREIGN KEY ("states_id") REFERENCES "dashapp_states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_marketing_platforms_primary" ADD CONSTRAINT "dashapp_leagueinfo_marketing_platform_marketingplatform_id_fkey" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_marketing_platforms_primary" ADD CONSTRAINT "dashapp_leagueinfo_marketing_platforms_prima_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_marketing_platforms_secondary" ADD CONSTRAINT "dashapp_leagueinfo_marketing_platfor_marketingplatform_id_fkey1" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_marketing_platforms_secondary" ADD CONSTRAINT "dashapp_leagueinfo_marketing_platforms_secon_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_owner" ADD CONSTRAINT "dashapp_leagueinfo_owner_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_owner" ADD CONSTRAINT "dashapp_leagueinfo_owner_leagueowner_id_fkey" FOREIGN KEY ("leagueowner_id") REFERENCES "dashapp_leagueowner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_personality_traits" ADD CONSTRAINT "dashapp_leagueinfo_personality_traits_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_personality_traits" ADD CONSTRAINT "dashapp_leagueinfo_personality_traits_subpersonality_id_fkey" FOREIGN KEY ("subpersonality_id") REFERENCES "dashapp_subpersonality"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_taglines" ADD CONSTRAINT "dashapp_leagueinfo_taglines_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_taglines" ADD CONSTRAINT "dashapp_leagueinfo_taglines_taglines_id_fkey" FOREIGN KEY ("taglines_id") REFERENCES "dashapp_taglines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_tier" ADD CONSTRAINT "dashapp_leagueinfo_tier_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo_tier" ADD CONSTRAINT "dashapp_leagueinfo_tier_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "dashapp_tier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_leagueowner" ADD CONSTRAINT "dashapp_leagueowner_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_level" ADD CONSTRAINT "dashapp_level_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_mainpersonality" ADD CONSTRAINT "dashapp_mainpersonality_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_marketingplatform" ADD CONSTRAINT "dashapp_marketingplatform_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_ottpartner" ADD CONSTRAINT "dashapp_ottpartner_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_parentorg" ADD CONSTRAINT "dashapp_parentorg_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_partner" ADD CONSTRAINT "dashapp_partner_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_property" ADD CONSTRAINT "dashapp_property_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_sport" ADD CONSTRAINT "dashapp_sport_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_sportsdealsummary" ADD CONSTRAINT "dashapp_sportsdealsummary_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_sportsdealsummary" ADD CONSTRAINT "dashapp_sportsdealsummary_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "dashapp_companydata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_sportsdealsummary" ADD CONSTRAINT "dashapp_sportsdealsummary_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_sportsdealsummary" ADD CONSTRAINT "dashapp_sportsdealsummary_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "dashapp_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_sportsdealsummary" ADD CONSTRAINT "dashapp_sportsdealsummary_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_sportsdealsummary" ADD CONSTRAINT "dashapp_sportsdealsummary_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_states" ADD CONSTRAINT "dashapp_states_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_subpersonality" ADD CONSTRAINT "dashapp_subpersonality_main_personality_id_fkey" FOREIGN KEY ("main_personality_id") REFERENCES "dashapp_mainpersonality"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_subpersonality" ADD CONSTRAINT "dashapp_subpersonality_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_taglines" ADD CONSTRAINT "dashapp_taglines_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team" ADD CONSTRAINT "dashapp_team_hq_city_id_fkey" FOREIGN KEY ("hq_city_id") REFERENCES "dashapp_hqcity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team" ADD CONSTRAINT "dashapp_team_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team" ADD CONSTRAINT "dashapp_team_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team" ADD CONSTRAINT "dashapp_team_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "dashapp_sport"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_active_campaigns" ADD CONSTRAINT "dashapp_team_active_campaigns_activecampaigns_id_fkey" FOREIGN KEY ("activecampaigns_id") REFERENCES "dashapp_activecampaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_active_campaigns" ADD CONSTRAINT "dashapp_team_active_campaigns_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_age" ADD CONSTRAINT "dashapp_team_age_age_id_fkey" FOREIGN KEY ("age_id") REFERENCES "dashapp_age"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_age" ADD CONSTRAINT "dashapp_team_age_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_gender" ADD CONSTRAINT "dashapp_team_gender_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "dashapp_gender"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_gender" ADD CONSTRAINT "dashapp_team_gender_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_income" ADD CONSTRAINT "dashapp_team_income_income_id_fkey" FOREIGN KEY ("income_id") REFERENCES "dashapp_income"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_income" ADD CONSTRAINT "dashapp_team_income_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_key_markets_primary" ADD CONSTRAINT "dashapp_team_key_markets_primary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_key_markets_primary" ADD CONSTRAINT "dashapp_team_key_markets_primary_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_key_markets_secondary" ADD CONSTRAINT "dashapp_team_key_markets_secondary_keymarket_id_fkey" FOREIGN KEY ("keymarket_id") REFERENCES "dashapp_keymarket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_key_markets_secondary" ADD CONSTRAINT "dashapp_team_key_markets_secondary_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_key_markets_tertiary" ADD CONSTRAINT "dashapp_team_key_markets_tertiary_states_id_fkey" FOREIGN KEY ("states_id") REFERENCES "dashapp_states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_key_markets_tertiary" ADD CONSTRAINT "dashapp_team_key_markets_tertiary_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_marketing_platforms_primary" ADD CONSTRAINT "dashapp_team_marketing_platforms_prim_marketingplatform_id_fkey" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_marketing_platforms_primary" ADD CONSTRAINT "dashapp_team_marketing_platforms_primary_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_marketing_platforms_secondary" ADD CONSTRAINT "dashapp_team_marketing_platforms_seco_marketingplatform_id_fkey" FOREIGN KEY ("marketingplatform_id") REFERENCES "dashapp_marketingplatform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_marketing_platforms_secondary" ADD CONSTRAINT "dashapp_team_marketing_platforms_secondary_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_owner" ADD CONSTRAINT "dashapp_team_owner_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_owner" ADD CONSTRAINT "dashapp_team_owner_teamowner_id_fkey" FOREIGN KEY ("teamowner_id") REFERENCES "dashapp_teamowner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_personality_traits" ADD CONSTRAINT "dashapp_team_personality_traits_subpersonality_id_fkey" FOREIGN KEY ("subpersonality_id") REFERENCES "dashapp_subpersonality"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_personality_traits" ADD CONSTRAINT "dashapp_team_personality_traits_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_taglines" ADD CONSTRAINT "dashapp_team_taglines_taglines_id_fkey" FOREIGN KEY ("taglines_id") REFERENCES "dashapp_taglines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_taglines" ADD CONSTRAINT "dashapp_team_taglines_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_tier" ADD CONSTRAINT "dashapp_team_tier_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_team_tier" ADD CONSTRAINT "dashapp_team_tier_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "dashapp_tier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_teamcontact" ADD CONSTRAINT "dashapp_teamcontact_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_teamcontact" ADD CONSTRAINT "dashapp_teamcontact_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_teamendorsements" ADD CONSTRAINT "dashapp_teamendorsements_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_teamendorsements" ADD CONSTRAINT "dashapp_teamendorsements_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_teamowner" ADD CONSTRAINT "dashapp_teamowner_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_territory" ADD CONSTRAINT "dashapp_territory_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_tier" ADD CONSTRAINT "dashapp_tier_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "django_admin_log" ADD CONSTRAINT "django_admin_log_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "django_content_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "django_admin_log" ADD CONSTRAINT "django_admin_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

