import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useInvalidateOffers } from "@/hooks/useInvalidateOffers";
import { apiFetch, ApiError } from "@/lib/api";
import type { UseEditDescriptionResult } from "./breeder-description.types";

export function useEditDescription(description: string | null): UseEditDescriptionResult {
  const queryClient = useQueryClient();
  const invalidateOffers = useInvalidateOffers();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEditing() {
    setDraft(description ?? "");
    setError(null);
    setIsEditing(true);
  }

  async function save() {
    setError(null);
    setSaving(true);
    try {
      await apiFetch("/api/breeders/me", {
        method: "PATCH",
        body: JSON.stringify({ description: draft || undefined }),
      });
      await queryClient.invalidateQueries({ queryKey: ["my-breeder-profile"] });
      await invalidateOffers();
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się zapisać opisu");
    } finally {
      setSaving(false);
    }
  }

  return {
    isEditing,
    draft,
    error,
    saving,
    setDraft,
    startEditing,
    cancel: () => setIsEditing(false),
    save,
  };
}
