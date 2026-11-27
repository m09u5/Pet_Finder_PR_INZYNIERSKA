"use client";

import Link from "next/link";
import { ReservationCard } from "@/components/reservations/reservation-card/ReservationCard";
import { ReservationList } from "@/components/reservations/reservation-list/ReservationList";
import { formatPrice, getReservationStage } from "@/components/reservations/shared/reservation.utils";
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
          details={`${reservation.offer.breedingName} · ${formatPrice(reservation.animal.price)}`}
        >
          <Link
            href={`/reservations/${reservation.id}`}
            className={buttonClass({
              variant: getReservationStage(reservation) === "UNPAID" ? "primary" : "outline",
              size: "sm",
            })}
          >
            {getReservationStage(reservation) === "UNPAID" ? "Opłać" : "Szczegóły"}
          </Link>
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
