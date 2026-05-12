-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "category" TEXT,
ADD COLUMN     "priceOptions" JSONB;

-- CreateIndex
CREATE INDEX "Menu_restaurantId_category_idx" ON "Menu"("restaurantId", "category");
