/*
  Warnings:

  - The `cost` column on the `association` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "association_athlete_id_idx";

-- AlterTable
ALTER TABLE "association" DROP COLUMN "cost",
ADD COLUMN     "cost" DECIMAL;

-- CreateIndex
CREATE INDEX "association_athlete_id_cost_idx" ON "association"("athlete_id", "cost");

-- CreateIndex
CREATE INDEX "association_association_level_id_idx" ON "association"("association_level_id");
