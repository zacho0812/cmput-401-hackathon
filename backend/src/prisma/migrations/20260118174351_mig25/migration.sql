/*
  Warnings:

  - You are about to drop the column `jobid` on the `Log` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_jobid_fkey";

-- AlterTable
ALTER TABLE "Log" DROP COLUMN "jobid";

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "master" BOOLEAN NOT NULL DEFAULT false;
