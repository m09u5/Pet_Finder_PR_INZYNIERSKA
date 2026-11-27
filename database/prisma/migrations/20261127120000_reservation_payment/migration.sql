ALTER TABLE "reservations" ADD COLUMN "pickupDate" DATE,
ADD COLUMN "depositAmount" DECIMAL(10,2),
ADD COLUMN "paidAt" TIMESTAMP(3);
