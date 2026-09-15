import type { ReservationStatus } from "./enums";

export interface PublicReservation {
  id: string;
  status: ReservationStatus;
  createdAt: string;
  animal: {
    id: string;
    name: string;
    species: string;
    breed: string;
    price: number;
  };
  offer: {
    id: string;
    title: string;
    breedingName: string;
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
