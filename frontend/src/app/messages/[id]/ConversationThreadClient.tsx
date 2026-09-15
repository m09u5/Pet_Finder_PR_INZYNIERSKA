"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PublicConversation, PublicMessage } from "@pet-finder/shared";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:4000";

interface MessagesResponse {
  messages: PublicMessage[];
  conversation: PublicConversation;
}

export function ConversationThreadClient({ id }: { id: string }) {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => apiFetch<MessagesResponse>(`/api/conversations/${id}/messages`),
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;
    const socket = new WebSocket(`${WS_URL}/ws/chat`);
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data) as { type: string; message?: PublicMessage };
      if (payload.type === "message" && payload.message?.conversationId === id) {
        queryClient.invalidateQueries({ queryKey: ["messages", id] });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    };
    return () => socket.close();
  }, [user, id, queryClient]);

  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      apiFetch(`/api/conversations/${id}/messages`, { method: "POST", body: JSON.stringify({ content }) }),
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["messages", id] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (err) => setSendError(err instanceof ApiError ? err.message : "Nie udało się wysłać wiadomości"),
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    setSendError(null);
    sendMutation.mutate(draft.trim());
  }

  if (authLoading) return null;
  if (!user) return <p className="p-6">Zaloguj się, aby zobaczyć wiadomości.</p>;
  if (isLoading) return <p className="p-6">Ładowanie...</p>;
  if (error || !data) return <p className="p-6 text-red-600">Nie znaleziono rozmowy.</p>;

  const otherParty = user.role === "BREEDER" ? data.conversation.customerName : data.conversation.breedingName;

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b pb-3 mb-3">
        <p className="font-medium">{otherParty}</p>
        <Link href={`/offers/${data.conversation.offerId}`} className="text-sm text-gray-500 hover:underline">
          {data.conversation.offerTitle}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {data.messages.map((message) => {
          const isMine = message.senderId === user.id;
          return (
            <div
              key={message.id}
              className={`max-w-[75%] px-3 py-2 rounded ${
                isMine ? "self-end bg-black text-white" : "self-start bg-gray-100 text-gray-900"
              }`}
            >
              <p>{message.content}</p>
              <p className={`text-xs mt-1 ${isMine ? "text-gray-300" : "text-gray-500"}`}>
                {new Date(message.createdAt).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          );
        })}
        {data.messages.length === 0 && <p className="text-gray-500">Brak wiadomości. Napisz pierwszą!</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-3 border-t pt-3">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Napisz wiadomość..."
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          type="submit"
          disabled={sendMutation.isPending}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Wyślij
        </button>
      </form>
      {sendError && <p className="text-red-600 text-sm mt-1">{sendError}</p>}
    </div>
  );
}
