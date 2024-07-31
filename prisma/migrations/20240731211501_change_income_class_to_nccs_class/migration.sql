/*
  Warnings:

  - You are about to drop the column `income_class` on the `dashapp_income` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nccs_class]` on the table `dashapp_income` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nccs_class` to the `dashapp_income` table without a default value. This is not possible if the table is not empty.

*/ -- DropIndex

DROP INDEX "sqlite_autoindex_dashapp_income_1";

-- AlterTable

ALTER TABLE "dashapp_income" RENAME COLUMN "income_class" TO "nccs_class";

-- CreateIndex

CREATE UNIQUE INDEX "sqlite_autoindex_dashapp_income_1" ON "dashapp_income"("nccs_class");

