ALTER TABLE "animals" ADD COLUMN "offerId" TEXT;
ALTER TABLE "animals" ADD COLUMN "price" DECIMAL(10,2);

UPDATE "animals" a
SET "offerId" = o.id, "price" = o.price
FROM "offers" o
WHERE o."animalId" = a.id;

WITH ranked AS (
  SELECT id, "breederId",
         row_number() OVER (PARTITION BY "breederId" ORDER BY "createdAt" ASC) AS rn
  FROM "offers"
),
keepers AS (
  SELECT "breederId", id AS keep_id FROM ranked WHERE rn = 1
),
losers AS (
  SELECT id AS lose_id, "breederId" FROM ranked WHERE rn > 1
)
UPDATE "animals" a
SET "offerId" = k.keep_id
FROM losers l
JOIN keepers k ON k."breederId" = l."breederId"
WHERE a."offerId" = l.lose_id;

DELETE FROM "offers" o
USING (
  SELECT id, row_number() OVER (PARTITION BY "breederId" ORDER BY "createdAt" ASC) AS rn
  FROM "offers"
) ranked
WHERE o.id = ranked.id AND ranked.rn > 1;

ALTER TABLE "animals" ALTER COLUMN "offerId" SET NOT NULL;
ALTER TABLE "animals" ALTER COLUMN "price" SET NOT NULL;

ALTER TABLE "animals" ADD CONSTRAINT "animals_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "animals_offerId_idx" ON "animals"("offerId");

ALTER TABLE "offers" DROP CONSTRAINT "offers_animalId_fkey";
DROP INDEX "offers_animalId_key";
ALTER TABLE "offers" DROP COLUMN "animalId";

DROP INDEX "offers_price_idx";
ALTER TABLE "offers" DROP COLUMN "price";

DROP INDEX "offers_breederId_idx";
CREATE UNIQUE INDEX "offers_breederId_key" ON "offers"("breederId");
