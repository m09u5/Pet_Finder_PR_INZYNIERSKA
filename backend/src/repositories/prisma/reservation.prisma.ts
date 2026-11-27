import { Prisma, type Reservation } from "@prisma/client";
import type { AnimalStatus, ReservationStatus } from "@pet-finder/shared";
import { prisma } from "../../config/prisma";
import { animalNotAvailableError } from "../../utils/validators/reservation.validators";
import type { AnimalWithOffer, ReservationPayment, ReservationRepository } from "../reservation.repository";

const reservationInclude = {
  animal: {
    include: {
      offer: {
        select: {
          id: true,
          title: true,
          breeder: { select: { breedingName: true, street: true, city: true, postalCode: true } },
        },
      },
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

  async pay(reservationId: string, payment: ReservationPayment, createdAfter: Date) {
    const { count } = await prisma.reservation.updateMany({
      where: { id: reservationId, status: "PENDING", paidAt: null, createdAt: { gt: createdAfter } },
      data: payment,
    });
    return count === 1;
  }

  async expireUnpaid(createdBefore: Date) {
    const overdue = await prisma.reservation.findMany({
      where: { status: "PENDING", paidAt: null, createdAt: { lte: createdBefore } },
    });

    let expired = 0;
    for (const reservation of overdue) {
      if (await this.changeStatus(reservation, "CANCELLED", "AVAILABLE", { paidAt: null })) {
        expired += 1;
      }
    }
    return expired;
  }

  confirm(reservation: Reservation) {
    return this.changeStatus(reservation, "CONFIRMED", "SOLD");
  }

  cancel(reservation: Reservation) {
    return this.changeStatus(reservation, "CANCELLED", "AVAILABLE");
  }

  private changeStatus(
    reservation: Reservation,
    status: ReservationStatus,
    animalStatus: AnimalStatus,
    condition: Prisma.ReservationWhereInput = {},
  ) {
    return prisma.$transaction(async (tx) => {
      const { count } = await tx.reservation.updateMany({
        where: { ...condition, id: reservation.id, status: "PENDING" },
        data: { status },
      });
      if (count === 0) {
        return false;
      }

      await tx.animal.update({ where: { id: reservation.animalId }, data: { status: animalStatus } });
      return true;
    });
  }
}
