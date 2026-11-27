import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useInvalidateReservations } from "@/components/reservations/shared/useInvalidateReservations";
import { apiFetch } from "@/lib/api";
import type { UsePayReservationResult } from "./reservation-payment.types";

export function usePayReservation(reservationId: string): UsePayReservationResult {
  const invalidateReservations = useInvalidateReservations();
  const [pickupDate, setPickupDate] = useState("");
  const payment = useMutation({
    mutationFn: () =>
      apiFetch(`/api/reservations/${reservationId}/pay`, {
        method: "PATCH",
        body: JSON.stringify({ pickupDate }),
      }),
    onSettled: invalidateReservations,
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    payment.mutate();
  }

  return {
    pickupDate,
    setPickupDate,
    submit,
    paying: payment.isPending,
    error: payment.error?.message ?? null,
  };
}
