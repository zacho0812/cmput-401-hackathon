-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('APPLIED', 'REJECTED', 'INTERVIEW', 'OFFER', 'SAVED', 'ACCEPTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "positiontTitle" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'SAVED',
    "location" TEXT,
    "deadline" TIMESTAMP(3),
    "dateapplied" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "data" JSONB,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "jobid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_userid_key" ON "Resume"("userid");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_jobid_fkey" FOREIGN KEY ("jobid") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
