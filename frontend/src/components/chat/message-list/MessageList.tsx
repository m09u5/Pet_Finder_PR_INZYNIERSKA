import { MessageBubble } from "@/components/chat/message-bubble/MessageBubble";
import type { MessageListProps } from "./message-list.types";

export function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-2">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} isMine={message.senderId === currentUserId} />
      ))}
      {messages.length === 0 && <p className="text-gray-500">Brak wiadomości. Napisz pierwszą!</p>}
    </div>
  );
}
