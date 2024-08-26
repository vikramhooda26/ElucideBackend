/*
  Warnings:

  - Added the required column `broadcast_partner_id` to the `dashapp_broadcast_partner_metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ottpartner_id` to the `dashapp_ott_partner_metrics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dashapp_broadcast_partner_metrics" ADD COLUMN     "broadcast_partner_id" BIGINT NOT NULL,
ALTER COLUMN "viewership" DROP NOT NULL,
ALTER COLUMN "reach" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dashapp_ott_partner_metrics" ADD COLUMN     "ottpartner_id" BIGINT NOT NULL,
ALTER COLUMN "viewership" DROP NOT NULL,
ALTER COLUMN "reach" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "dashapp_ott_partner_metrics" ADD CONSTRAINT "dashapp_ott_partner_metrics_ottpartner_id_fkey" FOREIGN KEY ("ottpartner_id") REFERENCES "dashapp_ottpartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashapp_broadcast_partner_metrics" ADD CONSTRAINT "dashapp_broadcast_partner_metrics_broadcast_partner_id_fkey" FOREIGN KEY ("broadcast_partner_id") REFERENCES "dashapp_broadcastpartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
