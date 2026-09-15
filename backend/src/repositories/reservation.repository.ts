import type { Prisma } from "@prisma/client";
import type { AnimalStatus, ReservationStatus } from "@pet-finder/shared";
import { prisma } from "../config/prisma";

const reservationInclude = {
  animal: {
    include: {
      offer: { select: { id: true, title: true, breeder: { select: { breedingName: true } } } },
    },
  },
  customer: { select: { id: true, firstName: true, lastName: true, email: true } },
} as const;

export const reservationRepository = {
  lockAnimalRow(tx: Prisma.TransactionClient, animalId: string) {
    return tx.$queryRaw<Array<{ id: string }>>`SELECT id FROM animals WHERE id = ${animalId} FOR UPDATE`;
  },
  findAnimalWithOffer(tx: Prisma.TransactionClient, animalId: string) {
    return tx.animal.findUnique({ where: { id: animalId }, include: { offer: true } });
  },
  createReservation(tx: Prisma.TransactionClient, animalId: string, customerId: string) {
    return tx.reservation.create({ data: { animalId, customerId } });
  },
  updateAnimalStatus(tx: Prisma.TransactionClient, animalId: string, status: AnimalStatus) {
    return tx.animal.update({ where: { id: animalId }, data: { status } });
  },
  findById(id: string) {
    return prisma.reservation.findUnique({ where: { id }, include: reservationInclude });
  },
  listForCustomer(customerId: string) {
    return prisma.reservation.findMany({
      where: { customerId },
      include: reservationInclude,
      orderBy: { createdAt: "desc" },
    });
  },
  listForBreeder(breederId: string) {
    return prisma.reservation.findMany({
      where: { animal: { breederId } },
      include: reservationInclude,
      orderBy: { createdAt: "desc" },
    });
  },
  updateStatus(id: string, status: ReservationStatus) {
    return prisma.reservation.update({ where: { id }, data: { status } });
  },
};
