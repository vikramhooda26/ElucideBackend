-- CreateEnum
CREATE TYPE "role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STAFF', 'USER');

-- AlterTable
ALTER TABLE "auth_user" ADD COLUMN     "role" "role" NOT NULL DEFAULT 'USER';
