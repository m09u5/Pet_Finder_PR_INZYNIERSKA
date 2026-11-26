import type { Prisma } from "@prisma/client";
import { getSpeciesAliases } from "../../utils/speciesKeywords";
import type { OfferSearchCriteria } from "../offer.repository";

function speciesConditions(term: string): Prisma.AnimalWhereInput[] {
  return [
    { species: { contains: term, mode: "insensitive" } },
    ...getSpeciesAliases(term).map((alias) => ({ species: { equals: alias, mode: "insensitive" as const } })),
  ];
}

function keywordCondition(term: string): Prisma.OfferWhereInput {
  return {
    OR: [
      { breeder: { breedingName: { contains: term, mode: "insensitive" } } },
      { animals: { some: { OR: [...speciesConditions(term), { breed: { contains: term, mode: "insensitive" } }] } } },
    ],
  };
}

export function buildOfferWhere(criteria: OfferSearchCriteria): Prisma.OfferWhereInput {
  const { keywords, species, breed, sex, minPrice, maxPrice } = criteria;

  const animalFilters: Prisma.AnimalWhereInput = {
    status: "AVAILABLE",
    ...(sex && { sex }),
    ...(species && { OR: speciesConditions(species) }),
    ...(breed && { breed: { contains: breed, mode: "insensitive" } }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
  };

  return {
    status: "ACTIVE",
    animals: { some: animalFilters },
    ...(keywords && { AND: keywords.split(/\s+/).map(keywordCondition) }),
  };
}
