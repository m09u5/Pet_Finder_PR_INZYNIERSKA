import { useEffect } from "react";
import { useInvalidateConversation } from "@/components/chat/shared/useInvalidateConversation";
import type { ChatSocketEvent } from "./conversation-thread.types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:4000";

export function useChatSocket(conversationId: string, userId: string | undefined) {
  const invalidateConversation = useInvalidateConversation(conversationId);

  useEffect(() => {
    if (!userId) return;
    const socket = new WebSocket(`${WS_URL}/ws/chat`);
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data) as ChatSocketEvent;
      if (payload.type === "message" && payload.message?.conversationId === conversationId) {
        invalidateConversation();
      }
    };
    return () => socket.close();
  }, [userId, conversationId, invalidateConversation]);
}
