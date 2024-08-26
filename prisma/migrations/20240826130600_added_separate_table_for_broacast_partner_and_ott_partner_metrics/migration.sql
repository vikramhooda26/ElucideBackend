/*
  Warnings:

  - You are about to drop the `dashapp_reach` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dashapp_viewership` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dashapp_reach" DROP CONSTRAINT "dashapp_reach_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_reach" DROP CONSTRAINT "dashapp_reach_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_reach" DROP CONSTRAINT "dashapp_reach_modified_by_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_reach" DROP CONSTRAINT "dashapp_reach_team_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_viewership" DROP CONSTRAINT "dashapp_viewership_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_viewership" DROP CONSTRAINT "dashapp_viewership_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_viewership" DROP CONSTRAINT "dashapp_viewership_modified_by_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_viewership" DROP CONSTRAINT "dashapp_viewership_team_id_fkey";

-- DropTable
DROP TABLE "dashapp_reach";

-- DropTable
DROP TABLE "dashapp_viewership";

-- DropEnum
DROP TYPE "viewship_type";

-- CreateTable
CREATE TABLE "dashapp_ott_partner_metrics" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,
    "viewership" TEXT NOT NULL,
    "reach" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "leagueinfo_id" BIGINT,
    "team_id" BIGINT,

    CONSTRAINT "dashapp_ott_partner_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_broadcast_partner_metrics" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,
    "viewership" TEXT NOT NULL,
    "reach" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "leagueinfo_id" BIGINT,
    "team_id" BIGINT,

    CONSTRAINT "dashapp_broadcast_partner_metrics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dashapp_ott_partner_metrics" ADD CONSTRAINT "dashapp_ott_partner_metrics_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_ott_partner_metrics" ADD CONSTRAINT "dashapp_ott_partner_metrics_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_ott_partner_metrics" ADD CONSTRAINT "dashapp_ott_partner_metrics_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_ott_partner_metrics" ADD CONSTRAINT "dashapp_ott_partner_metrics_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_broadcast_partner_metrics" ADD CONSTRAINT "dashapp_broadcast_partner_metrics_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_broadcast_partner_metrics" ADD CONSTRAINT "dashapp_broadcast_partner_metrics_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_broadcast_partner_metrics" ADD CONSTRAINT "dashapp_broadcast_partner_metrics_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_broadcast_partner_metrics" ADD CONSTRAINT "dashapp_broadcast_partner_metrics_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
