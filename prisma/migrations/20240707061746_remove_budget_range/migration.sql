/*
  Warnings:

  - You are about to drop the column `budget_range_from` on the `dashapp_athlete` table. All the data in the column will be lost.
  - You are about to drop the column `budget_range_to` on the `dashapp_athlete` table. All the data in the column will be lost.
  - You are about to drop the column `budget_range_from` on the `dashapp_leagueinfo` table. All the data in the column will be lost.
  - You are about to drop the column `budget_range_to` on the `dashapp_leagueinfo` table. All the data in the column will be lost.
  - You are about to drop the column `budget_range_from` on the `dashapp_team` table. All the data in the column will be lost.
  - You are about to drop the column `budget_range_to` on the `dashapp_team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dashapp_athlete" DROP COLUMN "budget_range_from",
DROP COLUMN "budget_range_to";

-- AlterTable
ALTER TABLE "dashapp_leagueinfo" DROP COLUMN "budget_range_from",
DROP COLUMN "budget_range_to";

-- AlterTable
ALTER TABLE "dashapp_team" DROP COLUMN "budget_range_from",
DROP COLUMN "budget_range_to";
