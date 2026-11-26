"use client";

import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { buttonClass, errorTextClass } from "@/styles/theme";
import type { MessageBreederButtonProps } from "./message-breeder-button.types";
import { useStartConversation } from "./useStartConversation";

export function MessageBreederButton({ offerId }: MessageBreederButtonProps) {
  const { user } = useAuth();
  const { start, starting, error } = useStartConversation(offerId);

  if (user?.role !== "CUSTOMER") return null;

  return (
    <div className="mb-6">
      <button type="button" onClick={start} disabled={starting} className={buttonClass({ variant: "outline" })}>
        {starting ? "Otwieranie..." : "Napisz do hodowcy"}
      </button>
      {error && <p className={clsx(errorTextClass, "mt-1")}>{error}</p>}
    </div>
  );
}
