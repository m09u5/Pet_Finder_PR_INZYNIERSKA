import { useQuery } from "@tanstack/react-query";
import type { PublicConversation } from "@pet-finder/shared";
import { apiFetch } from "@/lib/api";
import type { UseConversationsResult } from "./conversation-list.types";

export function useConversations(): UseConversationsResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => apiFetch<{ conversations: PublicConversation[] }>("/api/conversations"),
  });

  return { conversations: data?.conversations ?? [], isLoading, hasError: !!error };
}
