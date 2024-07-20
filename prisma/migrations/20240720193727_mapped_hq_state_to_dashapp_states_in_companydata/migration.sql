/*
  Warnings:

  - You are about to drop the column `hq_state` on the `dashapp_companydata` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dashapp_companydata" DROP COLUMN "hq_state",
ADD COLUMN     "hq_state_id" BIGINT;

-- AddForeignKey
ALTER TABLE "dashapp_companydata" ADD CONSTRAINT "dashapp_companydata_hq_state_id_fkey" FOREIGN KEY ("hq_state_id") REFERENCES "dashapp_states"("id") ON DELETE SET NULL ON UPDATE CASCADE;
