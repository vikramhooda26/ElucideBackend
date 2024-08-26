/*
  Warnings:

  - You are about to drop the column `gender` on the `dashapp_athlete` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dashapp_athlete" DROP COLUMN "gender",
ADD COLUMN     "gender_id" BIGINT;

-- AddForeignKey
ALTER TABLE "dashapp_athlete" ADD CONSTRAINT "dashapp_athlete_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "dashapp_gender"("id") ON DELETE SET NULL ON UPDATE CASCADE;
