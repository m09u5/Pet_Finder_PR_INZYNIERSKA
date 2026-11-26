import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BreederProfileWithOwner, VerificationStatus } from "@pet-finder/shared";
import type { VerificationDecision } from "@/components/admin/breeder-verification-card/breeder-verification-card.types";
import { apiFetch } from "@/lib/api";
import type { UseBreederVerificationResult } from "./breeder-verification.types";

export function useBreederVerification(): UseBreederVerificationResult {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<VerificationStatus>("PENDING");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-breeders", status],
    queryFn: () => apiFetch<{ items: BreederProfileWithOwner[] }>(`/api/admin/breeders?status=${status}`),
  });

  const mutation = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: VerificationDecision }) =>
      apiFetch(`/api/admin/breeders/${id}/verification`, {
        method: "PATCH",
        body: JSON.stringify({ status: decision }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-breeders"] }),
  });

  return {
    status,
    breeders: data?.items,
    isLoading,
    setStatus,
    decide: (id, decision) => mutation.mutate({ id, decision }),
  };
}
