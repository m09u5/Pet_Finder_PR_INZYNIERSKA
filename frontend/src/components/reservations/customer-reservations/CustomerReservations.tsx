"use client";

import { ReservationCard } from "@/components/reservations/reservation-card/ReservationCard";
import { ReservationList } from "@/components/reservations/reservation-list/ReservationList";
import { buttonClass } from "@/styles/theme";
import { useCustomerReservations } from "./useCustomerReservations";

export function CustomerReservations() {
  const { reservations, isLoading, hasError, cancel, cancelling, actionError } = useCustomerReservations();

  return (
    <ReservationList
      title="Moje rezerwacje"
      emptyMessage="Nie masz jeszcze żadnych rezerwacji."
      isLoading={isLoading}
      hasError={hasError}
      isEmpty={reservations.length === 0}
      actionError={actionError}
    >
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          details={`${reservation.offer.breedingName} · ${reservation.animal.price} zł`}
        >
          {reservation.status === "PENDING" && (
            <button
              type="button"
              onClick={() => cancel(reservation.id)}
              disabled={cancelling}
              className={buttonClass({ variant: "outline", size: "sm" })}
            >
              Anuluj
            </button>
          )}
        </ReservationCard>
      ))}
    </ReservationList>
  );
}
