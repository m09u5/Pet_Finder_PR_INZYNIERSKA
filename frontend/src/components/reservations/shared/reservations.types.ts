import type { PublicReservation } from "@pet-finder/shared";

export type ReservationAction = "confirm" | "cancel";

export type ReservationStage = "UNPAID" | "AWAITING_APPROVAL" | "CONFIRMED" | "CANCELLED" | "EXPIRED";

export interface UseReservationsQueryResult {
  reservations: PublicReservation[];
  isLoading: boolean;
  hasError: boolean;
}
