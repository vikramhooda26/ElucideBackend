/*
  Warnings:

  - You are about to drop the column `territory` on the `dashapp_sportsdealsummary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dashapp_sportsdealsummary" DROP COLUMN "territory",
ADD COLUMN     "territory_id" BIGINT;

-- AddForeignKey
ALTER TABLE "dashapp_sportsdealsummary" ADD CONSTRAINT "dashapp_sportsdealsummary_territory_id_fkey" FOREIGN KEY ("territory_id") REFERENCES "dashapp_territory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
