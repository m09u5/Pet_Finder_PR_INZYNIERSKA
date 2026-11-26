"use client";

import clsx from "clsx";
import { TextField } from "@/components/ui/text-field/TextField";
import { buttonClass, errorTextClass } from "@/styles/theme";
import type { MessageFormProps } from "./message-form.types";
import { useSendMessage } from "./useSendMessage";

export function MessageForm({ conversationId }: MessageFormProps) {
  const { draft, error, sending, setDraft, submit } = useSendMessage(conversationId);

  return (
    <>
      <form onSubmit={submit} className="flex gap-2 mt-3 border-t border-gray-200 pt-3">
        <TextField placeholder="Napisz wiadomość..." value={draft} onChangeAction={setDraft} className="flex-1" />
        <button type="submit" disabled={sending} className={buttonClass()}>
          Wyślij
        </button>
      </form>
      {error && <p className={clsx(errorTextClass, "mt-1")}>{error}</p>}
    </>
  );
}
