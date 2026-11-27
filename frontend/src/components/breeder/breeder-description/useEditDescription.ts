import { useState } from "react";
import { useInvalidateBreeder } from "@/hooks/useInvalidateBreeder";
import { apiFetch, ApiError } from "@/lib/api";
import type { UseEditDescriptionResult } from "./breeder-description.types";

export function useEditDescription(description: string | null): UseEditDescriptionResult {
  const invalidateBreeder = useInvalidateBreeder();
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
      await invalidateBreeder();
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
