import type { ReservationStatus } from "./enums";

export interface PublicReservation {
  id: string;
  status: ReservationStatus;
  createdAt: string;
  pickupDate: string | null;
  paidAt: string | null;
  paymentDeadline: string;
  isExpired: boolean;
  depositAmount: number;
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
    street: string;
    city: string;
    postalCode: string;
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
