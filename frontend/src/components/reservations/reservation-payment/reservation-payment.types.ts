import type { FormEvent } from "react";
import type { PublicReservation } from "@pet-finder/shared";

export interface ReservationPaymentProps {
  reservation: PublicReservation;
}

export interface UsePayReservationResult {
  pickupDate: string;
  setPickupDate: (value: string) => void;
  submit: (event: FormEvent) => void;
  paying: boolean;
  error: string | null;
}
