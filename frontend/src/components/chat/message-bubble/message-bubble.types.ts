import type { PublicMessage } from "@pet-finder/shared";

export interface MessageBubbleProps {
  message: PublicMessage;
  isMine: boolean;
}
