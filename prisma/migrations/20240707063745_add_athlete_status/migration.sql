-- AlterTable
ALTER TABLE "dashapp_athlete" ADD COLUMN     "status_id" BIGINT;

-- CreateTable
CREATE TABLE "dashapp_athlete_status" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3),
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,
    "status" TEXT NOT NULL,

    CONSTRAINT "dashapp_athlete_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_athlete_status_status_key" ON "dashapp_athlete_status"("status");

-- AddForeignKey
ALTER TABLE "dashapp_athlete" ADD CONSTRAINT "dashapp_athlete_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "dashapp_athlete_status"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_status" ADD CONSTRAINT "dashapp_athlete_status_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_status" ADD CONSTRAINT "dashapp_athlete_status_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
