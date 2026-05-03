-- CreateIndex
CREATE INDEX "ExchangeRequest_listingId_idx" ON "public"."ExchangeRequest"("listingId");

-- CreateIndex
CREATE INDEX "ExchangeRequest_requesterUserId_idx" ON "public"."ExchangeRequest"("requesterUserId");

-- CreateIndex
CREATE INDEX "Listing_status_idx" ON "public"."Listing"("status");

-- CreateIndex
CREATE INDEX "Listing_userId_idx" ON "public"."Listing"("userId");

-- CreateIndex
CREATE INDEX "Listing_status_userId_idx" ON "public"."Listing"("status", "userId");

-- CreateIndex
CREATE INDEX "User_role_approvalStatus_idx" ON "public"."User"("role", "approvalStatus");
