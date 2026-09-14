"use client";

export interface AnimalFormState {
  description: string;
  price: string;
  name: string;
  species: string;
  breed: string;
  sex: "FEMALE" | "MALE";
  birthDate: string;
}

interface AnimalFormFieldsProps {
  form: AnimalFormState;
  onChange: <K extends keyof AnimalFormState>(field: K, value: AnimalFormState[K]) => void;
}

export function AnimalFormFields({ form, onChange }: AnimalFormFieldsProps) {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={form.description}
        onChange={(event) => onChange("description", event.target.value)}
        className="text-gray-600 border p-2 rounded"
        placeholder="Opis zwierzęcia"
      />
      <input
        value={form.name}
        onChange={(event) => onChange("name", event.target.value)}
        className="border p-2 rounded"
        placeholder="Imię zwierzęcia"
      />
      <div className="flex gap-2">
        <input
          value={form.species}
          onChange={(event) => onChange("species", event.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="Gatunek"
        />
        <input
          value={form.breed}
          onChange={(event) => onChange("breed", event.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="Rasa"
        />
      </div>
      <div className="flex gap-2">
        <select
          value={form.sex}
          onChange={(event) => onChange("sex", event.target.value as AnimalFormState["sex"])}
          className="border p-2 rounded flex-1"
        >
          <option value="FEMALE">Samica</option>
          <option value="MALE">Samiec</option>
        </select>
        <input
          type="date"
          value={form.birthDate}
          onChange={(event) => onChange("birthDate", event.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>
      <input
        type="number"
        value={form.price}
        onChange={(event) => onChange("price", event.target.value)}
        className="text-xl border p-2 rounded"
        placeholder="Cena"
      />
    </div>
  );
}
