-- DropIndex
DROP INDEX "sqlite_autoindex_dashapp_companydata_1";

-- AlterTable
ALTER TABLE "dashapp_companydata" ALTER COLUMN "company_name" SET DATA TYPE TEXT;
