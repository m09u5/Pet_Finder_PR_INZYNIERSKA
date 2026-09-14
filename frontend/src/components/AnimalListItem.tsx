"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { PublicAnimal } from "@pet-finder/shared";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AnimalFormFields, type AnimalFormState } from "@/components/AnimalFormFields";
import { ImageGallery } from "@/components/ImageGallery";
import { ImageUploader } from "@/components/ImageUploader";

function toFormState(animal: PublicAnimal): AnimalFormState {
  return {
    description: animal.description ?? "",
    price: String(animal.price),
    name: animal.name,
    species: animal.species,
    breed: animal.breed,
    sex: animal.sex,
    birthDate: animal.birthDate.slice(0, 10),
  };
}

export function AnimalListItem({
  offerId,
  animal,
  editable,
}: {
  offerId: string;
  animal: PublicAnimal;
  editable: boolean;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<AnimalFormState>(() => toFormState(animal));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const available = animal.status === "AVAILABLE";

  function startEditing() {
    setForm(toFormState(animal));
    setError(null);
    setIsEditing(true);
  }

  function update<K extends keyof AnimalFormState>(field: K, value: AnimalFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function invalidateAll() {
    await queryClient.invalidateQueries({ queryKey: ["offer"] });
    await queryClient.invalidateQueries({ queryKey: ["my-offer"] });
    await queryClient.invalidateQueries({ queryKey: ["offers"] });
  }

  async function handleDeleteImage(imageId: string) {
    await apiFetch(`/api/images/${imageId}`, { method: "DELETE" });
    await invalidateAll();
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      await apiFetch(`/api/offers/${offerId}/animals/${animal.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: form.name,
          species: form.species,
          breed: form.breed,
          sex: form.sex,
          birthDate: form.birthDate,
          description: form.description || undefined,
          price: Number(form.price),
        }),
      });
      await invalidateAll();
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się zapisać zmian");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 border-t pt-6">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <AnimalFormFields form={form} onChange={update} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2 mt-1">
            <button onClick={handleSave} disabled={saving} className="bg-black text-white px-4 py-2 rounded">
              {saving ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
            <button onClick={() => setIsEditing(false)} disabled={saving} className="border px-4 py-2 rounded">
              Anuluj
            </button>
          </div>
        </div>
      ) : (
        <>
          <ImageGallery
            images={animal.images}
            alt={animal.name}
            onDeleteAction={editable ? handleDeleteImage : undefined}
          />
          {editable && <ImageUploader uploadUrl={`/api/offers/${offerId}/animals/${animal.id}/images`} />}
          <h2 className="text-lg font-medium mt-4">{animal.name}</h2>
          {animal.description && <p className="text-gray-600 mt-1">{animal.description}</p>}
          <div className="mt-3 text-sm flex flex-col gap-1">
            <p>
              Gatunek / rasa: {animal.species} / {animal.breed}
            </p>
            <p>Płeć: {animal.sex === "FEMALE" ? "Samica" : "Samiec"}</p>
            <p>Data urodzenia: {new Date(animal.birthDate).toLocaleDateString("pl-PL")}</p>
          </div>
          <p className="text-xl mt-3">{animal.price} zł</p>
          <div className="mt-4">
            {editable && (
              <button onClick={startEditing} className="border px-4 py-2 rounded">
                Edytuj
              </button>
            )}
            {!editable && !user && (
              <p className="text-sm text-gray-500">Zaloguj się, aby zarezerwować lub napisać do hodowcy.</p>
            )}
            {!editable && user?.role === "CUSTOMER" && available && (
              <button className="bg-black text-white px-4 py-2 rounded opacity-50" disabled>
                Zarezerwuj
              </button>
            )}
            {!editable && user?.role === "CUSTOMER" && !available && (
              <span className="inline-block px-4 py-2 rounded bg-gray-200 text-gray-600">
                {animal.status === "RESERVED" ? "Zarezerwowane" : "Niedostępne"}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
