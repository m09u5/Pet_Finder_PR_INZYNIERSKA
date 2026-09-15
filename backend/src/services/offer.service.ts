import type { Prisma } from "@prisma/client";
import { OfferSort, type AddAnimalInput, type ListOffersQuery, type UpdateAnimalInput } from "@pet-finder/shared";
import { offerRepository } from "../repositories/offer.repository";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/AppError";
import { geocodeQuery } from "./geocoding.service";

function buildOfferWhere(query: ListOffersQuery): Prisma.OfferWhereInput {
  const animalFilters: Prisma.AnimalWhereInput = {
    status: "AVAILABLE",
    ...(query.sex && { sex: query.sex }),
    ...(query.species && { species: { contains: query.species, mode: "insensitive" } }),
    ...(query.breed && { breed: { contains: query.breed, mode: "insensitive" } }),
    ...((query.minPrice !== undefined || query.maxPrice !== undefined) && {
      price: {
        ...(query.minPrice !== undefined && { gte: query.minPrice }),
        ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
      },
    }),
  };

  return {
    status: "ACTIVE",
    animals: { some: animalFilters },
    ...(query.q && {
      OR: [
        { breeder: { breedingName: { contains: query.q, mode: "insensitive" } } },
        {
          animals: {
            some: {
              OR: [
                { species: { contains: query.q, mode: "insensitive" } },
                { breed: { contains: query.q, mode: "insensitive" } },
              ],
            },
          },
        },
      ],
    }),
  };
}

export async function listPublicOffers(query: ListOffersQuery) {
  const where = buildOfferWhere(query);
  const offers = await offerRepository.listFiltered(where);

  let distanceById: Map<string, number> | null = null;
  if (query.radiusKm !== undefined) {
    const center =
      query.lat !== undefined && query.lng !== undefined
        ? { latitude: query.lat, longitude: query.lng }
        : query.locationText
          ? await geocodeQuery(query.locationText)
          : null;

    if (!center) {
      throw new BadRequestError("Nie udało się ustalić podanej lokalizacji", "LOCATION_NOT_FOUND");
    }

    const breederIds = [...new Set(offers.map((offer) => offer.breederId))];
    const distances = await offerRepository.getDistancesForBreeders(breederIds, center.latitude, center.longitude);
    distanceById = new Map(distances.map((entry) => [entry.id, entry.distance_km]));
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
    const existingSpecies = existingOffer.animals.at(0)?.species;
    if (existingSpecies && existingSpecies.toLowerCase() !== input.animal.species.toLowerCase()) {
      throw new BadRequestError(`Ta hodowla oferuje wyłącznie gatunek: ${existingSpecies}`, "SPECIES_MISMATCH");
    }
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
