import type { PublicReservation } from "@pet-finder/shared";
import type { ReservationStage } from "./reservations.types";

export const RESERVATION_STAGE_LABELS: Record<ReservationStage, string> = {
  UNPAID: "Nieopłacona",
  AWAITING_APPROVAL: "Czeka na zatwierdzenie",
  CONFIRMED: "Potwierdzona",
  CANCELLED: "Anulowana",
  EXPIRED: "Wygasła",
};

export function getReservationStage({ status, paidAt, isExpired }: PublicReservation): ReservationStage {
  if (isExpired) return "EXPIRED";
  if (status !== "PENDING") return status;
  return paidAt ? "AWAITING_APPROVAL" : "UNPAID";
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pl-PL");
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });
}

export function formatPrice(value: number) {
  return `${value.toLocaleString("pl-PL")} zł`;
}
