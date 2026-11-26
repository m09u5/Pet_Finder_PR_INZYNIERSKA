import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateOffers() {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["offer"] });
    await queryClient.invalidateQueries({ queryKey: ["my-offer"] });
    await queryClient.invalidateQueries({ queryKey: ["offers"] });
  }, [queryClient]);
}
