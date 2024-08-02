/*
  Warnings:

  - You are about to drop the column `nationality` on the `dashapp_athlete` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dashapp_athlete" DROP COLUMN "nationality",
ADD COLUMN     "nationality_id" BIGINT;

-- CreateTable
CREATE TABLE "dashapp_countries" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "modified_by_id" BIGINT,
    "created_by_id" BIGINT,
    "name" TEXT NOT NULL,

    CONSTRAINT "dashapp_countries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_countries_name_key" ON "dashapp_countries"("name");

-- AddForeignKey
ALTER TABLE "dashapp_countries" ADD CONSTRAINT "dashapp_countries_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_countries" ADD CONSTRAINT "dashapp_countries_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete" ADD CONSTRAINT "dashapp_athlete_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "dashapp_countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
