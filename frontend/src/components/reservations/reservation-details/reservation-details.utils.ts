import type { ReservationStage } from "@/components/reservations/shared/reservations.types";

export const STAGE_DESCRIPTIONS: Record<ReservationStage, string> = {
  UNPAID:
    "Zwierzę jest zablokowane dla Ciebie i nikt inny nie może go zarezerwować. Wybierz datę odbioru i opłać wstępną rezerwację w ciągu 3 dni, inaczej wygaśnie.",
  AWAITING_APPROVAL: "Wstępna rezerwacja została opłacona. Teraz hodowca musi ją zatwierdzić.",
  CONFIRMED: "Hodowca zatwierdził rezerwację. Do zobaczenia w dniu odbioru.",
  CANCELLED: "Ta rezerwacja została anulowana.",
  EXPIRED: "Rezerwacja wygasła, bo nie została opłacona w terminie. Zwierzę wróciło do puli dostępnych.",
};
