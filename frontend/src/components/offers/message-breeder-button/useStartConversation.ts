import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicConversation } from "@pet-finder/shared";
import { apiFetch, ApiError } from "@/lib/api";
import type { UseStartConversationResult } from "./message-breeder-button.types";

export function useStartConversation(offerId: string): UseStartConversationResult {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setError(null);
    setStarting(true);
    try {
      const { conversation } = await apiFetch<{ conversation: PublicConversation }>("/api/conversations", {
        method: "POST",
        body: JSON.stringify({ offerId }),
      });
      router.push(`/messages/${conversation.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się rozpocząć rozmowy");
    } finally {
      setStarting(false);
    }
  }

  return { start, starting, error };
}
