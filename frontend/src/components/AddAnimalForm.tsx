"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";
import { AnimalFormFields, type AnimalFormState } from "@/components/AnimalFormFields";

const initialForm: AnimalFormState = {
  description: "",
  price: "",
  name: "",
  species: "",
  breed: "",
  sex: "FEMALE",
  birthDate: "",
};

export function AddAnimalForm() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AnimalFormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof AnimalFormState>(field: K, value: AnimalFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit() {
    setError(null);
    setSaving(true);
    try {
      await apiFetch("/api/offers", {
        method: "POST",
        body: JSON.stringify({
          animal: {
            name: form.name,
            species: form.species,
            breed: form.breed,
            sex: form.sex,
            birthDate: form.birthDate,
            description: form.description || undefined,
            price: Number(form.price),
          },
        }),
      });
      await queryClient.invalidateQueries({ queryKey: ["offer"] });
      await queryClient.invalidateQueries({ queryKey: ["my-offer"] });
      await queryClient.invalidateQueries({ queryKey: ["offers"] });
      setForm(initialForm);
      setOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się dodać zwierzęcia");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="bg-black text-white px-4 py-2 rounded">
        Dodaj zwierzę
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimalFormFields form={form} onChange={update} />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-2 mt-1">
        <button onClick={handleSubmit} disabled={saving} className="bg-black text-white px-4 py-2 rounded">
          {saving ? "Zapisywanie..." : "Dodaj zwierzę"}
        </button>
        <button onClick={() => setOpen(false)} disabled={saving} className="border px-4 py-2 rounded">
          Anuluj
        </button>
      </div>
    </div>
  );
}
