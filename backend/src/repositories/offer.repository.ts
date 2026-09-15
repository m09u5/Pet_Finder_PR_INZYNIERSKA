import type { AnimalSex, OfferStatus } from "@pet-finder/shared";
import { prisma } from "../config/prisma";

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
      verificationStatus: true,
    },
  },
} as const;

interface AnimalFields {
  name: string;
  species: string;
  breed: string;
  sex: AnimalSex;
  birthDate: Date;
  description?: string;
  motherName?: string;
  fatherName?: string;
  price: number;
}

interface AnimalFieldsPatch {
  name?: string;
  species?: string;
  breed?: string;
  sex?: AnimalSex;
  birthDate?: Date;
  description?: string;
  motherName?: string;
  fatherName?: string;
  price?: number;
}

export const offerRepository = {
  findById(id: string) {
    return prisma.offer.findUnique({ where: { id }, include: offerInclude });
  },
  findByBreederId(breederId: string) {
    return prisma.offer.findUnique({ where: { breederId }, include: offerInclude });
  },
  listActive(params: { skip: number; take: number }) {
    return prisma.offer.findMany({
      where: { status: "ACTIVE" },
      include: offerInclude,
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
    });
  },
  countActive() {
    return prisma.offer.count({ where: { status: "ACTIVE" } });
  },
  createWithAnimal(input: { breederId: string; title: string; animal: AnimalFields }) {
    return prisma.offer.create({
      data: {
        breeder: { connect: { id: input.breederId } },
        title: input.title,
        animals: {
          create: {
            breeder: { connect: { id: input.breederId } },
            name: input.animal.name,
            species: input.animal.species,
            breed: input.animal.breed,
            sex: input.animal.sex,
            birthDate: input.animal.birthDate,
            description: input.animal.description,
            motherName: input.animal.motherName,
            fatherName: input.animal.fatherName,
            price: input.animal.price,
          },
        },
      },
      include: offerInclude,
    });
  },
  addAnimal(offerId: string, breederId: string, animal: AnimalFields) {
    return prisma.animal.create({
      data: {
        breeder: { connect: { id: breederId } },
        offer: { connect: { id: offerId } },
        name: animal.name,
        species: animal.species,
        breed: animal.breed,
        sex: animal.sex,
        birthDate: animal.birthDate,
        description: animal.description,
        motherName: animal.motherName,
        fatherName: animal.fatherName,
        price: animal.price,
      },
    });
  },
  updateAnimal(animalId: string, patch: AnimalFieldsPatch) {
    return prisma.animal.update({ where: { id: animalId }, data: patch });
  },
  updateStatus(id: string, status: OfferStatus) {
    return prisma.offer.update({ where: { id }, data: { status }, include: offerInclude });
  },
};
