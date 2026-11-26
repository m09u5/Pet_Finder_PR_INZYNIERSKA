import type { PublicMessage } from "@pet-finder/shared";

export interface MessageListProps {
  messages: PublicMessage[];
  currentUserId: string;
}
