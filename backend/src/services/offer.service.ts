import type { AddAnimalInput, ListOffersQuery, UpdateAnimalInput } from "@pet-finder/shared";
import { offerRepository } from "../repositories/offer.repository";
import { ForbiddenError, NotFoundError } from "../utils/AppError";

export async function listPublicOffers(query: ListOffersQuery) {
  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    offerRepository.listActive({ skip, take: query.limit }),
    offerRepository.countActive(),
  ]);
  return { items, total, page: query.page, limit: query.limit };
}

export async function getOfferById(id: string) {
  const offer = await offerRepository.findById(id);
  if (!offer) {
    throw new NotFoundError("Ogłoszenie nie istnieje");
  }
  return offer;
}

export function getMyOffer(breederId: string) {
  return offerRepository.findByBreederId(breederId);
}

export async function addAnimal(breederId: string, breedingName: string, input: AddAnimalInput) {
  const existingOffer = await offerRepository.findByBreederId(breederId);
  if (existingOffer) {
    await offerRepository.addAnimal(existingOffer.id, breederId, input.animal);
    return offerRepository.findById(existingOffer.id);
  }
  const title = `Zwierzęta z hodowli ${breedingName}`;
  return offerRepository.createWithAnimal({ breederId, title, animal: input.animal });
}

export async function updateAnimal(offerId: string, animalId: string, breederId: string, input: UpdateAnimalInput) {
  const offer = await offerRepository.findById(offerId);
  if (!offer) {
    throw new NotFoundError("Ogłoszenie nie istnieje");
  }
  if (offer.breederId !== breederId) {
    throw new ForbiddenError("To nie jest Twoje ogłoszenie", "NOT_OWNER");
  }
  const animal = offer.animals.find((item) => item.id === animalId);
  if (!animal) {
    throw new NotFoundError("Zwierzę nie istnieje w tym ogłoszeniu");
  }
  await offerRepository.updateAnimal(animalId, input);
  return offerRepository.findById(offerId);
}

export async function deactivateOffer(offerId: string, breederId: string) {
  const offer = await offerRepository.findById(offerId);
  if (!offer) {
    throw new NotFoundError("Ogłoszenie nie istnieje");
  }
  if (offer.breederId !== breederId) {
    throw new ForbiddenError("To nie jest Twoje ogłoszenie", "NOT_OWNER");
  }
  return offerRepository.updateStatus(offerId, "INACTIVE");
}
