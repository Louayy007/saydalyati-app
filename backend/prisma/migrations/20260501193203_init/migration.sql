/*
  Warnings:

  - The `status` column on the `ExchangeRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `urgency` column on the `Listing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `updatedAt` on the `Profile` table. All the data in the column will be lost.
  - The `establishmentType` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `approvalStatus` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `PasswordReset` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `Listing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ApprovalStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "public"."ExchangeRequest" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "public"."Listing" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "urgency",
ADD COLUMN     "urgency" TEXT NOT NULL DEFAULT 'normal';

-- AlterTable
ALTER TABLE "public"."Profile" DROP COLUMN "updatedAt",
ALTER COLUMN "fullName" DROP NOT NULL,
ALTER COLUMN "establishmentName" DROP NOT NULL,
DROP COLUMN "establishmentType",
ADD COLUMN     "establishmentType" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "approvalStatus",
ADD COLUMN     "approvalStatus" "public"."ApprovalStatus" NOT NULL DEFAULT 'approved';

-- DropTable
DROP TABLE "public"."PasswordReset";

-- DropEnum
DROP TYPE "public"."EstablishmentType";

-- DropEnum
DROP TYPE "public"."ListingType";

-- DropEnum
DROP TYPE "public"."RequestStatus";

-- DropEnum
DROP TYPE "public"."UrgencyLevel";

-- DropEnum
DROP TYPE "public"."UserApprovalStatus";

-- CreateTable
CREATE TABLE "public"."WaitingList" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "establishmentName" TEXT NOT NULL,
    "establishmentType" TEXT NOT NULL,
    "certificateFileName" TEXT NOT NULL,
    "certificateFileData" TEXT NOT NULL,
    "certificateMimeType" TEXT,
    "phone" TEXT,
    "wilaya" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitingList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WaitingList_email_key" ON "public"."WaitingList"("email");
