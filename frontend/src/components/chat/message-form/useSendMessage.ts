import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useInvalidateConversation } from "@/components/chat/shared/useInvalidateConversation";
import { apiFetch, ApiError } from "@/lib/api";
import type { UseSendMessageResult } from "./message-form.types";

export function useSendMessage(conversationId: string): UseSendMessageResult {
  const invalidateConversation = useInvalidateConversation(conversationId);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (content: string) =>
      apiFetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      }),
    onSuccess: () => {
      setDraft("");
      invalidateConversation();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Nie udało się wysłać wiadomości"),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    setError(null);
    mutation.mutate(draft.trim());
  }

  return { draft, error, sending: mutation.isPending, setDraft, submit };
}
