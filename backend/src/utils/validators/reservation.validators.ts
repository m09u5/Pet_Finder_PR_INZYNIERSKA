import type { AnimalWithOffer, ReservationWithRelations } from "../../repositories/reservation.repository";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../AppError";

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
