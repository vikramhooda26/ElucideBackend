-- CreateTable
CREATE TABLE "dashapp_format" (
    "id" BIGSERIAL NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "created_by_id" BIGINT,
    "modified_by_id" BIGINT,
    "format" TEXT NOT NULL,

    CONSTRAINT "dashapp_format_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dashapp_format" ADD CONSTRAINT "dashapp_format_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashapp_format" ADD CONSTRAINT "dashapp_format_modified_by_id_fkey" FOREIGN KEY ("modified_by_id") REFERENCES "auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
