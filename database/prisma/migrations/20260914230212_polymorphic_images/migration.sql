ALTER TABLE "images" DROP CONSTRAINT "images_offerId_fkey";
ALTER TABLE "images" ALTER COLUMN "offerId" DROP NOT NULL;
ALTER TABLE "images" ADD CONSTRAINT "images_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "images" ADD COLUMN "animalId" TEXT;
ALTER TABLE "images" ADD CONSTRAINT "images_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "images_animalId_idx" ON "images"("animalId");
