-- AlterTable
ALTER TABLE "dashapp_activation" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_activecampaigns" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_age" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_agency" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_assets" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_athlete" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_athletecontact" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_brandcontact" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_brandendorsements" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_broadcastpartner" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_category" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_companydata" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_gender" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_hqcity" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_income" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_keymarket" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_league" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_leaguecontact" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_leagueendorsements" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_leagueinfo" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_leagueowner" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_level" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_mainpersonality" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_marketingplatform" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_metric" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_ottpartner" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_parentorg" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_partner" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_property" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_sport" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_sportsdealsummary" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_states" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_subpersonality" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_taglines" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_team" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_teamcontact" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_teamendorsements" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_teamowner" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_territory" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_tier" ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- CreateTable
CREATE TABLE "association_level" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(512),
    "created_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3),
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,

    CONSTRAINT "association_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "association" (
    "id" BIGSERIAL NOT NULL,
    "cost" DECIMAL,
    "association_level_id" BIGINT,
    "created_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3),
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,
    "team_id" BIGINT,
    "leagueInfo_id" BIGINT,
    "athlete_id" BIGINT,
    "brand_id" BIGINT,

    CONSTRAINT "association_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "association_team_id_idx" ON "association"("team_id");

-- CreateIndex
CREATE INDEX "association_league_info_id_idx" ON "association"("leagueInfo_id");

-- CreateIndex
CREATE INDEX "association_athlete_id_idx" ON "association"("athlete_id");

-- CreateIndex
CREATE INDEX "association_brand_id_idx" ON "association"("brand_id");

-- AddForeignKey
ALTER TABLE "association_level" ADD CONSTRAINT "association_level_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "association_level" ADD CONSTRAINT "association_level_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "association" ADD CONSTRAINT "association_association_level_id_fkey" FOREIGN KEY ("association_level_id") REFERENCES "association_level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "association" ADD CONSTRAINT "association_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "association" ADD CONSTRAINT "association_leagueInfo_id_fkey" FOREIGN KEY ("leagueInfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "association" ADD CONSTRAINT "association_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "association" ADD CONSTRAINT "association_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "dashapp_companydata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "association" ADD CONSTRAINT "association_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "association" ADD CONSTRAINT "association_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
