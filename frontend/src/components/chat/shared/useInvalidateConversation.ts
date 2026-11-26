import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateConversation(conversationId: string) {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  }, [queryClient, conversationId]);
}
