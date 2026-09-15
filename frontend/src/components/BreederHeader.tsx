"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { VerificationStatus } from "@pet-finder/shared";
import { apiFetch, ApiError } from "@/lib/api";
import { STATIC_BREEDER_RATING } from "@/lib/staticRating";

interface BreederHeaderProps {
  breedingName: string;
  verificationStatus: VerificationStatus;
  street: string;
  city: string;
  postalCode: string;
  description: string | null;
  editable?: boolean;
}

export function BreederHeader({
  breedingName,
  verificationStatus,
  street,
  city,
  postalCode,
  description,
  editable,
}: BreederHeaderProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEditing() {
    setDraft(description ?? "");
    setError(null);
    setIsEditing(true);
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      await apiFetch("/api/breeders/me", {
        method: "PATCH",
        body: JSON.stringify({ description: draft || undefined }),
      });
      await queryClient.invalidateQueries({ queryKey: ["my-breeder-profile"] });
      await queryClient.invalidateQueries({ queryKey: ["offer"] });
      await queryClient.invalidateQueries({ queryKey: ["my-offer"] });
      await queryClient.invalidateQueries({ queryKey: ["offers"] });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się zapisać opisu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-medium">{breedingName}</h1>
        {verificationStatus === "VERIFIED" && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Zweryfikowana hodowla</span>
        )}
      </div>
      <p className="text-sm text-gray-500">★ {STATIC_BREEDER_RATING}</p>
      <p className="text-sm text-gray-500">
        {street}, {postalCode} {city}
      </p>

      {isEditing ? (
        <div className="flex flex-col gap-2 mt-2">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="text-gray-600 border p-2 rounded"
            placeholder="Opis hodowli"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="bg-black text-white px-3 py-1.5 rounded text-sm">
              {saving ? "Zapisywanie..." : "Zapisz opis"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className="border px-3 py-1.5 rounded text-sm"
            >
              Anuluj
            </button>
          </div>
        </div>
      ) : (
        <>
          {description && <p className="text-gray-600 mt-2">{description}</p>}
          {editable && (
            <button onClick={startEditing} className="border px-3 py-1 rounded text-sm mt-2">
              Edytuj opis hodowli
            </button>
          )}
        </>
      )}
    </div>
  );
}
