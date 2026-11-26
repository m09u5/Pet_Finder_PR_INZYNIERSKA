import type { FormEvent } from "react";

export interface MessageFormProps {
  conversationId: string;
}

export interface UseSendMessageResult {
  draft: string;
  error: string | null;
  sending: boolean;
  setDraft: (value: string) => void;
  submit: (event: FormEvent) => void;
}
