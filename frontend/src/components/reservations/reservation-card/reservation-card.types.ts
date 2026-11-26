import type { ReactNode } from "react";
import type { PublicReservation } from "@pet-finder/shared";

export interface ReservationCardProps {
  reservation: PublicReservation;
  details: string;
  children?: ReactNode;
}
