-- CreateTable
CREATE TABLE "dashapp_socialmedia_platform" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "modified_by_id" BIGINT,
    "created_by_id" BIGINT,
    "name" TEXT NOT NULL,

    CONSTRAINT "dashapp_socialmedia_platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_athlete_socialmedia_platform_primary" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "athlete_id" BIGINT,
    "socialmedia_platform_id" BIGINT,

    CONSTRAINT "dashapp_athlete_socialmedia_platform_primary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashapp_athlete_socialmedia_platform_secondary" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "athlete_id" BIGINT,
    "socialmedia_platform_id" BIGINT,

    CONSTRAINT "dashapp_athlete_socialmedia_platform_secondary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dashapp_socialmedia_platform_name_key" ON "dashapp_socialmedia_platform"("name");

-- AddForeignKey
ALTER TABLE "dashapp_socialmedia_platform" ADD CONSTRAINT "dashapp_socialmedia_platform_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_socialmedia_platform" ADD CONSTRAINT "dashapp_socialmedia_platform_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_socialmedia_platform_primary" ADD CONSTRAINT "dashapp_athlete_socialmedia_platform_primary_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_socialmedia_platform_primary" ADD CONSTRAINT "dashapp_athlete_socialmedia_platform_primary_socialmedia_p_fkey" FOREIGN KEY ("socialmedia_platform_id") REFERENCES "dashapp_socialmedia_platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_socialmedia_platform_secondary" ADD CONSTRAINT "dashapp_athlete_socialmedia_platform_secondary_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "dashapp_athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_athlete_socialmedia_platform_secondary" ADD CONSTRAINT "dashapp_athlete_socialmedia_platform_secondary_socialmedia_fkey" FOREIGN KEY ("socialmedia_platform_id") REFERENCES "dashapp_socialmedia_platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;
