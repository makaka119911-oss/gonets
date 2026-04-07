-- Роли: продавец
ALTER TYPE "UserRole" ADD VALUE 'SELLER';

-- Категории отправлений
CREATE TYPE "ShipmentCategory" AS ENUM ('FOOD', 'PARCEL', 'DOCUMENTS', 'GOODS', 'BULKY');

-- Расширение статусов заказа / трекинг по жизненному циклу
ALTER TYPE "OrderStatus" ADD VALUE 'CONFIRMED';
ALTER TYPE "OrderStatus" ADD VALUE 'IN_TRANSIT';
ALTER TYPE "OrderStatus" ADD VALUE 'AT_RECIPIENT';
ALTER TYPE "OrderStatus" ADD VALUE 'FAILED';

-- Заказ: категория, курьер, продавец (магазин)
ALTER TABLE "Order" ADD COLUMN "shipmentCategory" "ShipmentCategory" NOT NULL DEFAULT 'PARCEL';
ALTER TABLE "Order" ADD COLUMN "courierId" TEXT;
ALTER TABLE "Order" ADD COLUMN "sellerId" TEXT;

ALTER TABLE "Order" ADD CONSTRAINT "Order_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
