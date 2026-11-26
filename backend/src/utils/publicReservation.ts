import type { PublicReservation } from "@pet-finder/shared";
import type { ReservationWithRelations } from "../repositories/reservation.repository";

export function toPublicReservation(reservation: ReservationWithRelations): PublicReservation {
  return {
    id: reservation.id,
    status: reservation.status,
    createdAt: reservation.createdAt.toISOString(),
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
    },
    customer: {
      id: reservation.customer.id,
      firstName: reservation.customer.firstName,
      lastName: reservation.customer.lastName,
      email: reservation.customer.email,
    },
  };
}
