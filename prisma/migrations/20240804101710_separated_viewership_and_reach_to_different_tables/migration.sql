/*
  Warnings:

  - You are about to drop the `dashapp_metric` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dashapp_metric" DROP CONSTRAINT "dashapp_metric_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_metric" DROP CONSTRAINT "dashapp_metric_leagueinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_metric" DROP CONSTRAINT "dashapp_metric_modified_by_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_metric" DROP CONSTRAINT "dashapp_metric_team_id_fkey";

-- DropTable
DROP TABLE "dashapp_metric";

-- CreateTable
CREATE TABLE "dashapp_reach" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3),
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,
    "reach" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "leagueinfo_id" BIGINT,
    "team_id" BIGINT,

    CONSTRAINT "dashapp_reach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_viewership" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3),
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,
    "viewship_type" "viewship_type" NOT NULL,
    "viewership" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "leagueinfo_id" BIGINT,
    "team_id" BIGINT,

    CONSTRAINT "dashapp_viewership_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dashapp_reach" ADD CONSTRAINT "dashapp_reach_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_reach" ADD CONSTRAINT "dashapp_reach_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_reach" ADD CONSTRAINT "dashapp_reach_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_reach" ADD CONSTRAINT "dashapp_reach_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_viewership" ADD CONSTRAINT "dashapp_viewership_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_viewership" ADD CONSTRAINT "dashapp_viewership_leagueinfo_id_fkey" FOREIGN KEY ("leagueinfo_id") REFERENCES "dashapp_leagueinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_viewership" ADD CONSTRAINT "dashapp_viewership_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_viewership" ADD CONSTRAINT "dashapp_viewership_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dashapp_team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
