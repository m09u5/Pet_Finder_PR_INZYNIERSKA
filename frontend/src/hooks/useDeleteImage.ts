import { useCallback } from "react";
import { useInvalidateOffers } from "@/hooks/useInvalidateOffers";
import { apiFetch } from "@/lib/api";

export function useDeleteImage() {
  const invalidateOffers = useInvalidateOffers();

  return useCallback(
    async (imageId: string) => {
      await apiFetch(`/api/images/${imageId}`, { method: "DELETE" });
      await invalidateOffers();
    },
    [invalidateOffers],
  );
}
