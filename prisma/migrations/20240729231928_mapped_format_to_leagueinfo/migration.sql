/*
  Warnings:

  - You are about to drop the column `format` on the `dashapp_leagueinfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dashapp_leagueinfo" DROP COLUMN "format",
ADD COLUMN     "format_id" BIGINT;

-- AddForeignKey
ALTER TABLE "dashapp_leagueinfo" ADD CONSTRAINT "dashapp_leagueinfo_format_id_fkey" FOREIGN KEY ("format_id") REFERENCES "dashapp_format"("id") ON DELETE SET NULL ON UPDATE CASCADE;
