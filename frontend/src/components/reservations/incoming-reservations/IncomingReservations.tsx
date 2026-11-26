"use client";

import { ReservationCard } from "@/components/reservations/reservation-card/ReservationCard";
import { ReservationList } from "@/components/reservations/reservation-list/ReservationList";
import { buttonClass } from "@/styles/theme";
import { useIncomingReservations } from "./useIncomingReservations";

export function IncomingReservations() {
  const { reservations, isLoading, hasError, confirm, reject, updating, actionError } = useIncomingReservations();

  return (
    <ReservationList
      title="Rezerwacje"
      emptyMessage="Brak rezerwacji."
      isLoading={isLoading}
      hasError={hasError}
      isEmpty={reservations.length === 0}
      actionError={actionError}
    >
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          details={`${reservation.customer.firstName} ${reservation.customer.lastName} · ${reservation.customer.email}`}
        >
          {reservation.status === "PENDING" && (
            <>
              <button
                type="button"
                onClick={() => confirm(reservation.id)}
                disabled={updating}
                className={buttonClass({ size: "sm" })}
              >
                Potwierdź
              </button>
              <button
                type="button"
                onClick={() => reject(reservation.id)}
                disabled={updating}
                className={buttonClass({ variant: "outline", size: "sm" })}
              >
                Odrzuć
              </button>
            </>
          )}
        </ReservationCard>
      ))}
    </ReservationList>
  );
}
