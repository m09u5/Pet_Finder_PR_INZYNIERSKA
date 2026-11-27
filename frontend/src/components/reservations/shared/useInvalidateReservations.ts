import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useInvalidateOffers } from "@/hooks/useInvalidateOffers";

export function useInvalidateReservations() {
  const queryClient = useQueryClient();
  const invalidateOffers = useInvalidateOffers();

  return useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] }),
      queryClient.invalidateQueries({ queryKey: ["incoming-reservations"] }),
      queryClient.invalidateQueries({ queryKey: ["reservation"] }),
      invalidateOffers(),
    ]);
  }, [queryClient, invalidateOffers]);
}
