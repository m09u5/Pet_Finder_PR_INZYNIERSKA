import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { VerifyEmailResponse } from "./verify-email.types";

export function useVerifyEmail(token: string) {
  return useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => apiFetch<VerifyEmailResponse>(`/api/auth/verify-email?${new URLSearchParams({ token })}`),
    enabled: token !== "",
    retry: false,
    retryOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}
