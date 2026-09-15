"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { PublicConversation } from "@pet-finder/shared";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ConversationsListPage() {
  const { user, loading: authLoading } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => apiFetch<{ conversations: PublicConversation[] }>("/api/conversations"),
    enabled: !!user,
  });

  if (authLoading) return null;
  if (!user) return <p className="p-6">Zaloguj się, aby zobaczyć wiadomości.</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Wiadomości</h1>
      {isLoading && <p>Ładowanie...</p>}
      {error && <p className="text-red-600">Nie udało się pobrać wiadomości.</p>}
      {!isLoading && !error && !data?.conversations.length && <p>Nie masz jeszcze żadnych rozmów.</p>}

      <div className="flex flex-col gap-2">
        {data?.conversations.map((conversation) => {
          const otherParty = user.role === "BREEDER" ? conversation.customerName : conversation.breedingName;
          return (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="border rounded p-3 flex justify-between items-center hover:shadow"
            >
              <div>
                <p className="font-medium">{otherParty}</p>
                <p className="text-sm text-gray-500">{conversation.offerTitle}</p>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-500 truncate max-w-md">{conversation.lastMessage.content}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
