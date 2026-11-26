import type { Animal, BreederProfile, Offer, Reservation, User } from "@prisma/client";

export type ReservationWithRelations = Reservation & {
  animal: Animal & { offer: Pick<Offer, "id" | "title"> & { breeder: Pick<BreederProfile, "breedingName"> } };
  customer: Pick<User, "id" | "firstName" | "lastName" | "email">;
};

export type AnimalWithOffer = Animal & { offer: Offer };

export interface ReservationRepository {
  findById(id: string): Promise<ReservationWithRelations | null>;
  listForCustomer(customerId: string): Promise<ReservationWithRelations[]>;
  listForBreeder(breederId: string): Promise<ReservationWithRelations[]>;
  reserveAnimal(
    animalId: string,
    customerId: string,
    validate: (animal: AnimalWithOffer | null) => void,
  ): Promise<Reservation>;
  confirm(reservation: Reservation): Promise<void>;
  cancel(reservation: Reservation): Promise<void>;
}
