import type { PublicConversation } from "@pet-finder/shared";

export interface UseConversationsResult {
  conversations: PublicConversation[];
  isLoading: boolean;
  hasError: boolean;
}
