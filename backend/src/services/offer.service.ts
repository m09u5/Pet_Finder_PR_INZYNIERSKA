import { OfferSort, type AddAnimalInput, type ListOffersQuery, type UpdateAnimalInput } from "@pet-finder/shared";
import { offerRepository } from "../config/repositories";
import { requireFound } from "../utils/validators/found.validators";
import {
  assertOfferOwner,
  assertSameSpecies,
  requireAnimalInOffer,
  requireSearchCenter,
} from "../utils/validators/offer.validators";
import { geocodeQuery } from "./geocoding.service";

export async function listPublicOffers(query: ListOffersQuery) {
  const offers = await offerRepository.search({
    keywords: query.q,
    species: query.species,
    breed: query.breed,
    sex: query.sex,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
  });

  let distanceById: Map<string, number> | null = null;
  if (query.radiusKm !== undefined) {
    const center = requireSearchCenter(
      query.lat !== undefined && query.lng !== undefined
        ? { latitude: query.lat, longitude: query.lng }
        : query.locationText
          ? await geocodeQuery(query.locationText)
          : null,
    );

    const breederIds = [...new Set(offers.map((offer) => offer.breederId))];
    const distances = await offerRepository.getDistancesForBreeders(breederIds, center);
    distanceById = new Map(distances.map((entry) => [entry.breederId, entry.distanceKm]));
  }

  const radiusKm = query.radiusKm;
  const filtered =
    radiusKm === undefined
      ? offers
      : offers.filter((offer) => {
          const distance = distanceById!.get(offer.breederId);
          return distance !== undefined && distance <= radiusKm;
        });

  const withMeta = filtered.map((offer) => ({
    offer,
    distanceKm: distanceById?.get(offer.breederId) ?? null,
    minPrice: Math.min(
      ...offer.animals.filter((animal) => animal.status === "AVAILABLE").map((animal) => animal.price.toNumber()),
    ),
  }));

  withMeta.sort((a, b) => {
    switch (query.sort) {
      case OfferSort.PRICE_ASC:
        return a.minPrice - b.minPrice;
      case OfferSort.PRICE_DESC:
        return b.minPrice - a.minPrice;
      case OfferSort.DISTANCE:
        return (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);
      default:
        return b.offer.createdAt.getTime() - a.offer.createdAt.getTime();
    }
  });

  const total = withMeta.length;
  const start = (query.page - 1) * query.limit;
  const page = withMeta.slice(start, start + query.limit);

  return {
    items: page.map((entry) => ({ offer: entry.offer, distanceKm: entry.distanceKm })),
    total,
    page: query.page,
    limit: query.limit,
  };
}

export async function getOfferById(id: string) {
  return requireFound(await offerRepository.findById(id), "Ogłoszenie nie istnieje");
}

export function getMyOffer(breederId: string) {
  return offerRepository.findByBreederId(breederId);
}

export async function addAnimal(breederId: string, breedingName: string, input: AddAnimalInput) {
  const existingOffer = await offerRepository.findByBreederId(breederId);
  if (existingOffer) {
    assertSameSpecies(existingOffer, input.animal.species);
    await offerRepository.addAnimal(existingOffer.id, breederId, input.animal);
    return getOfferById(existingOffer.id);
  }
  const title = `Zwierzęta z hodowli ${breedingName}`;
  return offerRepository.createWithAnimal({ breederId, title, animal: input.animal });
}

export async function updateAnimal(offerId: string, animalId: string, breederId: string, input: UpdateAnimalInput) {
  const offer = await getOfferById(offerId);
  assertOfferOwner(offer, breederId);
  requireAnimalInOffer(offer, animalId);
  await offerRepository.updateAnimal(animalId, input);
  return getOfferById(offerId);
}

export async function deactivateOffer(offerId: string, breederId: string) {
  assertOfferOwner(await getOfferById(offerId), breederId);
  return offerRepository.updateStatus(offerId, "INACTIVE");
}
