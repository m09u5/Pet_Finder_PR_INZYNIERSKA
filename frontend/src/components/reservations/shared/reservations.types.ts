import type { PublicReservation } from "@pet-finder/shared";

export type ReservationAction = "confirm" | "cancel";

export interface UseReservationsQueryResult {
  reservations: PublicReservation[];
  isLoading: boolean;
  hasError: boolean;
}
