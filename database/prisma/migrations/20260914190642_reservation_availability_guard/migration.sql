-- Prevents two customers from ever holding a simultaneous active reservation
-- on the same animal. This is the last line of defense against the race
-- condition described in the spec (section 10): even if application-level
-- transaction logic had a gap, the database itself rejects the duplicate.
CREATE UNIQUE INDEX "reservations_active_animal_unique"
  ON "reservations" ("animalId")
  WHERE "status" IN ('PENDING', 'CONFIRMED');
