import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicReservation } from "@pet-finder/shared";
import { useInvalidateReservations } from "@/components/reservations/shared/useInvalidateReservations";
import { apiFetch, ApiError } from "@/lib/api";
import type { UseReserveAnimalResult } from "./reserve-button.types";

export function useReserveAnimal(animalId: string): UseReserveAnimalResult {
  const router = useRouter();
  const invalidateReservations = useInvalidateReservations();
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reserve() {
    setError(null);
    setReserving(true);
    try {
      const { reservation } = await apiFetch<{ reservation: PublicReservation }>("/api/reservations", {
        method: "POST",
        body: JSON.stringify({ animalId }),
      });
      router.push(`/reservations/${reservation.id}`);
      await invalidateReservations();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się zarezerwować zwierzęcia");
      setReserving(false);
      await invalidateReservations();
    }
  }

  return { reserve, reserving, error };
}
