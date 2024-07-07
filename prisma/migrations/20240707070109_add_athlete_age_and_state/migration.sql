-- AlterTable
ALTER TABLE "dashapp_athlete" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "state_id" BIGINT;

-- AddForeignKey
ALTER TABLE "dashapp_athlete" ADD CONSTRAINT "dashapp_athlete_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "dashapp_states"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
