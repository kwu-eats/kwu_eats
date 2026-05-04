/*
  Warnings:

  - You are about to drop the column `partnerInfo` on the `Restaurant` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "College" AS ENUM ('AI_CONVERGENCE', 'ENGINEERING', 'NATURAL_SCIENCE', 'BUSINESS', 'ELECTRONICS_INFO', 'HUMANITIES_SOCIAL', 'POLICY_LAW');

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "partnerInfo";

-- CreateTable
CREATE TABLE "RestaurantPartnership" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "college" "College" NOT NULL,
    "instagramUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantPartnership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RestaurantPartnership_college_idx" ON "RestaurantPartnership"("college");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantPartnership_restaurantId_college_key" ON "RestaurantPartnership"("restaurantId", "college");

-- AddForeignKey
ALTER TABLE "RestaurantPartnership" ADD CONSTRAINT "RestaurantPartnership_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
