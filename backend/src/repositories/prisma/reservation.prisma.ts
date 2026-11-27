import { Prisma, type Reservation } from "@prisma/client";
import type { AnimalStatus, ReservationStatus } from "@pet-finder/shared";
import { prisma } from "../../config/prisma";
import { animalNotAvailableError } from "../../utils/validators/reservation.validators";
import type { AnimalWithOffer, ReservationRepository } from "../reservation.repository";

const reservationInclude = {
  animal: {
    include: {
      offer: { select: { id: true, title: true, breeder: { select: { breedingName: true } } } },
    },
  },
  customer: { select: { id: true, firstName: true, lastName: true, email: true } },
} as const;

export class PrismaReservationRepository implements ReservationRepository {
  findById(id: string) {
    return prisma.reservation.findUnique({ where: { id }, include: reservationInclude });
  }

  listForCustomer(customerId: string) {
    return prisma.reservation.findMany({
      where: { customerId },
      include: reservationInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  listForBreeder(breederId: string) {
    return prisma.reservation.findMany({
      where: { animal: { breederId } },
      include: reservationInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async reserveAnimal(animalId: string, customerId: string, validate: (animal: AnimalWithOffer | null) => void) {
    try {
      return await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT id FROM animals WHERE id = ${animalId} FOR UPDATE`;
        validate(await tx.animal.findUnique({ where: { id: animalId }, include: { offer: true } }));

        const reservation = await tx.reservation.create({ data: { animalId, customerId } });
        await tx.animal.update({ where: { id: animalId }, data: { status: "RESERVED" } });
        return reservation;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw animalNotAvailableError();
      }
      throw error;
    }
  }

  confirm(reservation: Reservation) {
    return this.changeStatus(reservation, "CONFIRMED", "SOLD");
  }

  cancel(reservation: Reservation) {
    return this.changeStatus(reservation, "CANCELLED", "AVAILABLE");
  }

  private async changeStatus(reservation: Reservation, status: ReservationStatus, animalStatus: AnimalStatus) {
    await prisma.$transaction([
      prisma.animal.update({ where: { id: reservation.animalId }, data: { status: animalStatus } }),
      prisma.reservation.update({ where: { id: reservation.id }, data: { status } }),
    ]);
  }
}
