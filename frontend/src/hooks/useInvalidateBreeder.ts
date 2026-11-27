import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useInvalidateOffers } from "@/hooks/useInvalidateOffers";

export function useInvalidateBreeder() {
  const queryClient = useQueryClient();
  const invalidateOffers = useInvalidateOffers();

  return useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["my-breeder-profile"] });
    await invalidateOffers();
  }, [queryClient, invalidateOffers]);
}
