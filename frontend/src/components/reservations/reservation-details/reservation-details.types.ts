import type { PublicReservation } from "@pet-finder/shared";

export interface ReservationDetailsProps {
  reservationId: string;
}

export interface UseReservationResult {
  reservation: PublicReservation | null;
  isLoading: boolean;
  cancel: () => void;
  cancelling: boolean;
  actionError: string | null;
}
