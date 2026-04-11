-- CreateEnum
CREATE TYPE "public"."UserApprovalStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "approvalStatus" "public"."UserApprovalStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "approvedAt" TIMESTAMP(3);
