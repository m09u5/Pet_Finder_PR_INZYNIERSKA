import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { MessagesResponse } from "./conversation-thread.types";

export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => apiFetch<MessagesResponse>(`/api/conversations/${conversationId}/messages`),
  });
}
