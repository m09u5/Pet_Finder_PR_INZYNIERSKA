import type { PublicReservation } from "@pet-finder/shared";
import type { ReservationWithRelations } from "../repositories/reservation.repository";
import { calculateDeposit } from "./reservationDeposit";
import { getPaymentDeadline } from "./reservationExpiry";

export function toPublicReservation(reservation: ReservationWithRelations): PublicReservation {
  const paymentDeadline = getPaymentDeadline(reservation.createdAt);
  const isExpired =
    reservation.status === "CANCELLED" && !reservation.paidAt && reservation.updatedAt >= paymentDeadline;

  return {
    id: reservation.id,
    status: reservation.status,
    createdAt: reservation.createdAt.toISOString(),
    pickupDate: reservation.pickupDate?.toISOString().slice(0, 10) ?? null,
    paidAt: reservation.paidAt?.toISOString() ?? null,
    paymentDeadline: paymentDeadline.toISOString(),
    isExpired,
    depositAmount: reservation.depositAmount?.toNumber() ?? calculateDeposit(reservation.animal.price.toNumber()),
    animal: {
      id: reservation.animal.id,
      name: reservation.animal.name,
      species: reservation.animal.species,
      breed: reservation.animal.breed,
      price: reservation.animal.price.toNumber(),
    },
    offer: {
      id: reservation.animal.offer.id,
      title: reservation.animal.offer.title,
      breedingName: reservation.animal.offer.breeder.breedingName,
      street: reservation.animal.offer.breeder.street,
      city: reservation.animal.offer.breeder.city,
      postalCode: reservation.animal.offer.breeder.postalCode,
    },
    customer: {
      id: reservation.customer.id,
      firstName: reservation.customer.firstName,
      lastName: reservation.customer.lastName,
      email: reservation.customer.email,
    },
  };
}
