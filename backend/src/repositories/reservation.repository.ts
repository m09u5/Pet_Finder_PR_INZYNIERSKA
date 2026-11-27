import type { Animal, BreederProfile, Offer, Reservation, User } from "@prisma/client";

export type ReservationWithRelations = Reservation & {
  animal: Animal & {
    offer: Pick<Offer, "id" | "title"> & {
      breeder: Pick<BreederProfile, "breedingName" | "street" | "city" | "postalCode">;
    };
  };
  customer: Pick<User, "id" | "firstName" | "lastName" | "email">;
};

export type AnimalWithOffer = Animal & { offer: Offer };

export interface ReservationPayment {
  pickupDate: Date;
  depositAmount: number;
  paidAt: Date;
}

export interface ReservationRepository {
  findById(id: string): Promise<ReservationWithRelations | null>;
  listForCustomer(customerId: string): Promise<ReservationWithRelations[]>;
  listForBreeder(breederId: string): Promise<ReservationWithRelations[]>;
  reserveAnimal(
    animalId: string,
    customerId: string,
    validate: (animal: AnimalWithOffer | null) => void,
  ): Promise<Reservation>;
  pay(reservationId: string, payment: ReservationPayment, createdAfter: Date): Promise<boolean>;
  expireUnpaid(createdBefore: Date): Promise<number>;
  confirm(reservation: Reservation): Promise<boolean>;
  cancel(reservation: Reservation): Promise<boolean>;
}
