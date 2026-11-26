"use client";

import clsx from "clsx";
import Link from "next/link";
import { MessageForm } from "@/components/chat/message-form/MessageForm";
import { MessageList } from "@/components/chat/message-list/MessageList";
import { getOtherPartyName } from "@/components/chat/shared/chat.utils";
import { useAuth } from "@/context/AuthContext";
import { mutedTextClass, narrowPageClass, pageClass } from "@/styles/theme";
import type { ConversationThreadProps } from "./conversation-thread.types";
import { useChatSocket } from "./useChatSocket";
import { useConversationMessages } from "./useConversationMessages";

export function ConversationThread({ conversationId }: ConversationThreadProps) {
  const { user } = useAuth();
  const { data, isLoading, error } = useConversationMessages(conversationId);
  useChatSocket(conversationId, user?.id);

  if (!user) return null;
  if (isLoading) return <p className={pageClass}>Ładowanie...</p>;
  if (error || !data) return <p className={clsx(pageClass, "text-red-600")}>Nie znaleziono rozmowy.</p>;

  return (
    <div className={clsx(narrowPageClass, "w-full flex flex-col h-[calc(100vh-4rem)]")}>
      <div className="border-b border-gray-200 pb-3 mb-3">
        <p className="font-medium">{getOtherPartyName(data.conversation, user.role)}</p>
        <Link href={`/offers/${data.conversation.offerId}`} className={clsx(mutedTextClass, "hover:underline")}>
          {data.conversation.offerTitle}
        </Link>
      </div>
      <MessageList messages={data.messages} currentUserId={user.id} />
      <MessageForm conversationId={conversationId} />
    </div>
  );
}
