"use client";

import clsx from "clsx";
import { fieldClass } from "@/styles/theme";
import type { AnimalFieldsProps } from "@/components/animals/form/shared/animal-form-shared.types";

export function AnimalIdentityFields({ form, onChangeAction }: AnimalFieldsProps) {
  return (
    <>
      <textarea
        value={form.description}
        onChange={(event) => onChangeAction("description", event.target.value)}
        className={fieldClass}
        placeholder="Opis zwierzęcia"
      />
      <input
        value={form.name}
        onChange={(event) => onChangeAction("name", event.target.value)}
        className={fieldClass}
        placeholder="Imię zwierzęcia"
      />
      <div className="flex gap-2">
        <input
          value={form.species}
          onChange={(event) => onChangeAction("species", event.target.value)}
          className={clsx(fieldClass, "flex-1 min-w-0")}
          placeholder="Gatunek"
        />
        <input
          value={form.breed}
          onChange={(event) => onChangeAction("breed", event.target.value)}
          className={clsx(fieldClass, "flex-1 min-w-0")}
          placeholder="Rasa"
        />
      </div>
    </>
  );
}
