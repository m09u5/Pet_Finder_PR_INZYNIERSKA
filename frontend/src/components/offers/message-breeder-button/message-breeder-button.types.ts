export interface MessageBreederButtonProps {
  offerId: string;
}

export interface UseStartConversationResult {
  start: () => Promise<void>;
  starting: boolean;
  error: string | null;
}
