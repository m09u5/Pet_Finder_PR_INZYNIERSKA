import type { AnimalWithOffer, ReservationWithRelations } from "../../repositories/reservation.repository";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../AppError";
import { getPaymentDeadline } from "../reservationExpiry";

export function animalNotAvailableError() {
  return new ConflictError("To zwierzę nie jest już dostępne", "ANIMAL_NOT_AVAILABLE");
}

export function assertAnimalReservable(animal: AnimalWithOffer | null) {
  if (!animal || animal.offer.status !== "ACTIVE") {
    throw new NotFoundError("Zwierzę nie istnieje");
  }
  if (animal.status !== "AVAILABLE") {
    throw animalNotAvailableError();
  }
}

export function assertReservationOfBreeder(reservation: ReservationWithRelations, breederId: string) {
  if (reservation.animal.breederId !== breederId) {
    throw new ForbiddenError("To nie jest rezerwacja Twojego zwierzęcia", "NOT_OWNER");
  }
}

export function assertReservationAccess(
  reservation: ReservationWithRelations,
  customerId: string,
  breederId: string | null,
) {
  const isOwnCustomer = reservation.customerId === customerId;
  const isOwnBreeder = breederId !== null && reservation.animal.breederId === breederId;
  if (!isOwnCustomer && !isOwnBreeder) {
    throw new ForbiddenError("Brak dostępu do tej rezerwacji", "NOT_OWNER");
  }
}

export function assertPending(reservation: ReservationWithRelations, message: string) {
  if (reservation.status !== "PENDING") {
    throw new BadRequestError(message, "INVALID_STATUS");
  }
}

export function assertReservationOfCustomer(reservation: ReservationWithRelations, customerId: string) {
  if (reservation.customerId !== customerId) {
    throw new ForbiddenError("Brak dostępu do tej rezerwacji", "NOT_OWNER");
  }
}

export function assertUnpaid(reservation: ReservationWithRelations) {
  if (reservation.paidAt) {
    throw new BadRequestError("Rezerwacja jest już opłacona", "ALREADY_PAID");
  }
}

export function assertPaid(reservation: ReservationWithRelations) {
  if (!reservation.paidAt) {
    throw new BadRequestError("Klient nie opłacił jeszcze rezerwacji", "PAYMENT_REQUIRED");
  }
}

export function assertStatusChanged(changed: boolean) {
  if (!changed) {
    throw new ConflictError("Status rezerwacji zmienił się w międzyczasie", "RESERVATION_CHANGED");
  }
}

export function assertPaymentWindowOpen(reservation: ReservationWithRelations) {
  if (getPaymentDeadline(reservation.createdAt) <= new Date()) {
    throw new BadRequestError("Termin płatności za tę rezerwację minął", "PAYMENT_EXPIRED");
  }
}
