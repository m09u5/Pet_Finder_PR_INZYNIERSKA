import clsx from "clsx";
import type { MessageBubbleProps } from "./message-bubble.types";

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  return (
    <div
      className={clsx(
        "max-w-[75%] px-3 py-2 rounded",
        isMine ? "self-end bg-emerald-600 text-white" : "self-start bg-gray-100 text-gray-900",
      )}
    >
      <p>{message.content}</p>
      <p className={clsx("text-xs mt-1", isMine ? "text-emerald-100" : "text-gray-500")}>
        {new Date(message.createdAt).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}
