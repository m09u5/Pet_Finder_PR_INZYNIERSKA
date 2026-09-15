import { Prisma } from "@prisma/client";
import type { CreateReservationInput } from "@pet-finder/shared";
import { prisma } from "../config/prisma";
import { reservationRepository } from "../repositories/reservation.repository";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../utils/AppError";

export async function createReservation(customerId: string, input: CreateReservationInput) {
  let reservationId: string;

  try {
    const created = await prisma.$transaction(async (tx) => {
      await reservationRepository.lockAnimalRow(tx, input.animalId);
      const animal = await reservationRepository.findAnimalWithOffer(tx, input.animalId);

      if (!animal || animal.offer.status !== "ACTIVE") {
        throw new NotFoundError("Zwierzę nie istnieje");
      }
      if (animal.status !== "AVAILABLE") {
        throw new ConflictError("To zwierzę nie jest już dostępne", "ANIMAL_NOT_AVAILABLE");
      }

      const reservation = await reservationRepository.createReservation(tx, input.animalId, customerId);
      await reservationRepository.updateAnimalStatus(tx, input.animalId, "RESERVED");
      return reservation;
    });
    reservationId = created.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ConflictError("To zwierzę nie jest już dostępne", "ANIMAL_NOT_AVAILABLE");
    }
    throw error;
  }

  return reservationRepository.findById(reservationId);
}

export function listMyReservations(customerId: string) {
  return reservationRepository.listForCustomer(customerId);
}

export function listIncomingReservations(breederId: string) {
  return reservationRepository.listForBreeder(breederId);
}

export async function confirmReservation(reservationId: string, breederId: string) {
  const reservation = await reservationRepository.findById(reservationId);
  if (!reservation) {
    throw new NotFoundError("Rezerwacja nie istnieje");
  }
  if (reservation.animal.breederId !== breederId) {
    throw new ForbiddenError("To nie jest rezerwacja Twojego zwierzęcia", "NOT_OWNER");
  }
  if (reservation.status !== "PENDING") {
    throw new BadRequestError("Można potwierdzić tylko oczekującą rezerwację", "INVALID_STATUS");
  }

  await prisma.$transaction([
    prisma.animal.update({ where: { id: reservation.animalId }, data: { status: "SOLD" } }),
    prisma.reservation.update({ where: { id: reservationId }, data: { status: "CONFIRMED" } }),
  ]);

  return reservationRepository.findById(reservationId);
}

export async function cancelReservation(reservationId: string, customerId: string, breederId: string | null) {
  const reservation = await reservationRepository.findById(reservationId);
  if (!reservation) {
    throw new NotFoundError("Rezerwacja nie istnieje");
  }

  const isOwnCustomer = reservation.customerId === customerId;
  const isOwnBreeder = breederId !== null && reservation.animal.breederId === breederId;
  if (!isOwnCustomer && !isOwnBreeder) {
    throw new ForbiddenError("Brak dostępu do tej rezerwacji", "NOT_OWNER");
  }
  if (reservation.status !== "PENDING") {
    throw new BadRequestError("Można anulować tylko oczekującą rezerwację", "INVALID_STATUS");
  }

  await prisma.$transaction([
    prisma.animal.update({ where: { id: reservation.animalId }, data: { status: "AVAILABLE" } }),
    prisma.reservation.update({ where: { id: reservationId }, data: { status: "CANCELLED" } }),
  ]);

  return reservationRepository.findById(reservationId);
}
