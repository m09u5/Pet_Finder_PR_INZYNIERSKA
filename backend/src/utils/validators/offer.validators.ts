import type { Coordinates } from "../../repositories/breeder.repository";
import type { AnimalWithImages, OfferWithRelations } from "../../repositories/offer.repository";
import { BadRequestError, ForbiddenError } from "../AppError";
import { requireFound } from "./found.validators";

export function assertOfferOwner(offer: OfferWithRelations, breederId: string) {
  if (offer.breederId !== breederId) {
    throw new ForbiddenError("To nie jest Twoje ogłoszenie", "NOT_OWNER");
  }
}

export function requireAnimalInOffer(offer: OfferWithRelations, animalId: string): AnimalWithImages {
  return requireFound(
    offer.animals.find((animal) => animal.id === animalId),
    "Zwierzę nie istnieje w tym ogłoszeniu",
  );
}

export function assertSameSpecies(offer: OfferWithRelations, species: string) {
  const existingSpecies = offer.animals.at(0)?.species;
  if (existingSpecies && existingSpecies.toLowerCase() !== species.toLowerCase()) {
    throw new BadRequestError(`Ta hodowla oferuje wyłącznie gatunek: ${existingSpecies}`, "SPECIES_MISMATCH");
  }
}

export function requireSearchCenter(center: Coordinates | null): Coordinates {
  if (!center) {
    throw new BadRequestError("Nie udało się ustalić podanej lokalizacji", "LOCATION_NOT_FOUND");
  }
  return center;
}
