import type { PublicReservation } from "@pet-finder/shared";

export const RESERVATION_STATUS_LABELS: Record<PublicReservation["status"], string> = {
  PENDING: "Oczekująca",
  CONFIRMED: "Potwierdzona",
  CANCELLED: "Anulowana",
};
