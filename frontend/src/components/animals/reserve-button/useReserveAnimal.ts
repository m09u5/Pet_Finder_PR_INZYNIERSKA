import { useState } from "react";
import { useInvalidateOffers } from "@/hooks/useInvalidateOffers";
import { apiFetch, ApiError } from "@/lib/api";
import type { UseReserveAnimalResult } from "./reserve-button.types";

export function useReserveAnimal(animalId: string): UseReserveAnimalResult {
  const invalidateOffers = useInvalidateOffers();
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reserve() {
    setError(null);
    setReserving(true);
    try {
      await apiFetch("/api/reservations", {
        method: "POST",
        body: JSON.stringify({ animalId }),
      });
      await invalidateOffers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się zarezerwować zwierzęcia");
    } finally {
      setReserving(false);
    }
  }

  return { reserve, reserving, error };
}
