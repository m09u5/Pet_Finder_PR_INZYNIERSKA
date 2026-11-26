import clsx from "clsx";
import Link from "next/link";
import { listCardClass, mutedTextClass } from "@/styles/theme";
import type { ConversationCardProps } from "./conversation-card.types";

export function ConversationCard({ conversation, title }: ConversationCardProps) {
  return (
    <Link href={`/messages/${conversation.id}`} className={clsx(listCardClass, "hover:shadow")}>
      <div>
        <p className="font-medium">{title}</p>
        <p className={mutedTextClass}>{conversation.offerTitle}</p>
        {conversation.lastMessage && (
          <p className={clsx(mutedTextClass, "truncate max-w-md")}>{conversation.lastMessage.content}</p>
        )}
      </div>
    </Link>
  );
}
