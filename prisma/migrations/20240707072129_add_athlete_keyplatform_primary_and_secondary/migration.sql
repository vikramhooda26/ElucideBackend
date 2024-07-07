-- AlterTable
ALTER TABLE "dashapp_athlete" ADD COLUMN     "keyplatform_primary_id" BIGINT,
ADD COLUMN     "keyplatform_secondary_id" BIGINT;

-- CreateTable
CREATE TABLE "dashapp_keyplatform" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3),
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,
    "platform" TEXT NOT NULL,

    CONSTRAINT "dashapp_keyplatform_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_keyplatform_platform_key" ON "dashapp_keyplatform"("platform");

-- AddForeignKey
ALTER TABLE "dashapp_athlete" ADD CONSTRAINT "dashapp_athlete_keyplatform_primary_id_fkey" FOREIGN KEY ("keyplatform_primary_id") REFERENCES "dashapp_keyplatform"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete" ADD CONSTRAINT "dashapp_athlete_keyplatform_secondary_id_fkey" FOREIGN KEY ("keyplatform_secondary_id") REFERENCES "dashapp_keyplatform"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_keyplatform" ADD CONSTRAINT "dashapp_keyplatform_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_keyplatform" ADD CONSTRAINT "dashapp_keyplatform_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
