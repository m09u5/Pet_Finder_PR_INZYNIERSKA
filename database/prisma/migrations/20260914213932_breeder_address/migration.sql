ALTER TABLE "breeder_profiles" ADD COLUMN "street" TEXT;
ALTER TABLE "breeder_profiles" ADD COLUMN "city" TEXT;
ALTER TABLE "breeder_profiles" ADD COLUMN "postalCode" TEXT;

UPDATE "breeder_profiles" SET "street" = '', "city" = '', "postalCode" = '' WHERE "street" IS NULL;

ALTER TABLE "breeder_profiles" ALTER COLUMN "street" SET NOT NULL;
ALTER TABLE "breeder_profiles" ALTER COLUMN "city" SET NOT NULL;
ALTER TABLE "breeder_profiles" ALTER COLUMN "postalCode" SET NOT NULL;

ALTER TABLE "breeder_profiles" ALTER COLUMN "latitude" DROP NOT NULL;
ALTER TABLE "breeder_profiles" ALTER COLUMN "longitude" DROP NOT NULL;

DROP INDEX "breeder_profiles_latitude_longitude_idx";
CREATE INDEX "breeder_profiles_city_idx" ON "breeder_profiles" ("city");
