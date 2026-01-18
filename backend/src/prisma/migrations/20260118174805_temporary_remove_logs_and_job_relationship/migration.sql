/*
  Warnings:

  - You are about to drop the column `desc` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `jobid` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Log` table. All the data in the column will be lost.
  - Added the required column `contact` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CommType" AS ENUM ('EMAIL', 'PHONE', 'IN_PERSON', 'LINKEDIN', 'OTHER');

-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_jobid_fkey";

-- AlterTable
ALTER TABLE "Log" DROP COLUMN "desc",
DROP COLUMN "jobid",
DROP COLUMN "title",
ADD COLUMN     "contact" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "type" "CommType" NOT NULL DEFAULT 'EMAIL';
