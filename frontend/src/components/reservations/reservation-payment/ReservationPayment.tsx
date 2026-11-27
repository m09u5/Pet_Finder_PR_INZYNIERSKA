"use client";

import clsx from "clsx";
import { getPickupDateRange } from "@pet-finder/shared";
import { formatPrice } from "@/components/reservations/shared/reservation.utils";
import { buttonClass, errorTextClass, fieldClass, mutedTextClass, whiteBoxClass } from "@/styles/theme";
import type { ReservationPaymentProps } from "./reservation-payment.types";
import { usePayReservation } from "./usePayReservation";

export function ReservationPayment({ reservation }: ReservationPaymentProps) {
  const { pickupDate, setPickupDate, submit, paying, error } = usePayReservation(reservation.id);
  const { min, max } = getPickupDateRange();

  return (
    <form onSubmit={submit} className={clsx(whiteBoxClass, "flex flex-col gap-3")}>
      <label className="flex flex-col gap-1 text-sm">
        Na kiedy planujesz odbiór?
        <input
          type="date"
          required
          min={min}
          max={max}
          value={pickupDate}
          onChange={(event) => setPickupDate(event.target.value)}
          className={fieldClass}
        />
      </label>
      <button type="submit" disabled={paying} className={buttonClass({ fullWidth: true, className: "py-4 text-lg" })}>
        {paying ? "Przetwarzanie..." : `Opłać wstępną rezerwację · ${formatPrice(reservation.depositAmount)}`}
      </button>
      <p className={clsx(mutedTextClass, "text-center")}>Płatność jest symulowana — nie pobieramy pieniędzy.</p>
      {error && <p className={errorTextClass}>{error}</p>}
    </form>
  );
}
