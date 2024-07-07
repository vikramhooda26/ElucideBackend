/*
  Warnings:

  - You are about to drop the `dashapp_activation_property` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dashapp_activation_property" DROP CONSTRAINT "dashapp_activation_property_activation_id_fkey";

-- DropForeignKey
ALTER TABLE "dashapp_activation_property" DROP CONSTRAINT "dashapp_activation_property_property_id_fkey";

-- DropTable
DROP TABLE "dashapp_activation_property";
