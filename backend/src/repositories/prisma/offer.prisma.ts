import { Prisma } from "@prisma/client";
import type { OfferStatus } from "@pet-finder/shared";
import { prisma } from "../../config/prisma";
import type { Coordinates } from "../breeder.repository";
import type { AnimalFields, NewOffer, OfferRepository, OfferSearchCriteria } from "../offer.repository";
import { buildOfferWhere } from "./offer.filters";

const offerInclude = {
  animals: { include: { images: true } },
  images: true,
  breeder: {
    select: {
      id: true,
      userId: true,
      breedingName: true,
      description: true,
      street: true,
      city: true,
      postalCode: true,
      latitude: true,
      longitude: true,
      verificationStatus: true,
    },
  },
} as const;

function toAnimalData(animal: AnimalFields) {
  return {
    name: animal.name,
    species: animal.species,
    breed: animal.breed,
    sex: animal.sex,
    birthDate: animal.birthDate,
    description: animal.description,
    motherName: animal.motherName,
    fatherName: animal.fatherName,
    price: animal.price,
  };
}

export class PrismaOfferRepository implements OfferRepository {
  findById(id: string) {
    return prisma.offer.findUnique({ where: { id }, include: offerInclude });
  }

  findByBreederId(breederId: string) {
    return prisma.offer.findUnique({ where: { breederId }, include: offerInclude });
  }

  search(criteria: OfferSearchCriteria) {
    return prisma.offer.findMany({
      where: buildOfferWhere(criteria),
      include: offerInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async getDistancesForBreeders(breederIds: string[], origin: Coordinates) {
    if (breederIds.length === 0) return [];
    return prisma.$queryRaw<Array<{ breederId: string; distanceKm: number }>>`
      SELECT id AS "breederId",
        (6371 * acos(
          LEAST(1, GREATEST(-1,
            cos(radians(${origin.latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${origin.longitude}))
            + sin(radians(${origin.latitude})) * sin(radians(latitude))
          ))
        )) AS "distanceKm"
      FROM breeder_profiles
      WHERE id IN (${Prisma.join(breederIds)})
        AND latitude IS NOT NULL AND longitude IS NOT NULL
    `;
  }

  createWithAnimal({ breederId, title, animal }: NewOffer) {
    return prisma.offer.create({
      data: {
        breeder: { connect: { id: breederId } },
        title,
        animals: {
          create: { breeder: { connect: { id: breederId } }, ...toAnimalData(animal) },
        },
      },
      include: offerInclude,
    });
  }

  addAnimal(offerId: string, breederId: string, animal: AnimalFields) {
    return prisma.animal.create({
      data: {
        breeder: { connect: { id: breederId } },
        offer: { connect: { id: offerId } },
        ...toAnimalData(animal),
      },
    });
  }

  updateAnimal(animalId: string, patch: Partial<AnimalFields>) {
    return prisma.animal.update({ where: { id: animalId }, data: patch });
  }

  updateStatus(id: string, status: OfferStatus) {
    return prisma.offer.update({ where: { id }, data: { status }, include: offerInclude });
  }
}
