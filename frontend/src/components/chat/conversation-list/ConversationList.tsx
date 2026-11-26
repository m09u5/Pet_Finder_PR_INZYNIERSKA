"use client";

import { ConversationCard } from "@/components/chat/conversation-card/ConversationCard";
import { getOtherPartyName } from "@/components/chat/shared/chat.utils";
import { useAuth } from "@/context/AuthContext";
import { listClass, pageClass, pageTitleClass } from "@/styles/theme";
import { useConversations } from "./useConversations";

export function ConversationList() {
  const { user } = useAuth();
  const { conversations, isLoading, hasError } = useConversations();

  if (!user) return null;

  return (
    <div className={pageClass}>
      <h1 className={pageTitleClass}>Wiadomości</h1>
      {isLoading && <p>Ładowanie...</p>}
      {hasError && <p className="text-red-600">Nie udało się pobrać wiadomości.</p>}
      {!isLoading && !hasError && conversations.length === 0 && <p>Nie masz jeszcze żadnych rozmów.</p>}

      <div className={listClass}>
        {conversations.map((conversation) => (
          <ConversationCard
            key={conversation.id}
            conversation={conversation}
            title={getOtherPartyName(conversation, user.role)}
          />
        ))}
      </div>
    </div>
  );
}
