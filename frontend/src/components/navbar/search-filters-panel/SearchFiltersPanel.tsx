"use client";

import { buttonClass, fieldClass } from "@/styles/theme";
import type { SearchSex } from "@/components/navbar/search-bar/search-bar.types";
import type { SearchFiltersPanelProps } from "./search-filters-panel.types";

const RADIUS_OPTIONS = [20, 50, 100, 200];

export function SearchFiltersPanel({ filters, onChangeAction, onSubmitAction }: SearchFiltersPanelProps) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Gatunek"
          value={filters.species}
          onChange={(event) => onChangeAction("species", event.target.value)}
          className={fieldClass}
        />
        <input
          type="text"
          placeholder="Rasa"
          value={filters.breed}
          onChange={(event) => onChangeAction("breed", event.target.value)}
          className={fieldClass}
        />
        <select
          value={filters.sex}
          onChange={(event) => onChangeAction("sex", event.target.value as SearchSex)}
          className={fieldClass}
        >
          <option value="">Płeć: dowolna</option>
          <option value="MALE">Samiec</option>
          <option value="FEMALE">Samica</option>
        </select>
        <input
          type="number"
          placeholder="Cena od"
          value={filters.minPrice}
          onChange={(event) => onChangeAction("minPrice", event.target.value)}
          className={fieldClass}
        />
        <input
          type="number"
          placeholder="Cena do"
          value={filters.maxPrice}
          onChange={(event) => onChangeAction("maxPrice", event.target.value)}
          className={fieldClass}
        />
        <select
          value={filters.radiusKm}
          onChange={(event) => onChangeAction("radiusKm", event.target.value)}
          className={fieldClass}
        >
          {RADIUS_OPTIONS.map((km) => (
            <option key={km} value={km}>
              do {km} km
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={onSubmitAction}
        className={buttonClass({ fullWidth: true, className: "mt-3" })}
      >
        Szukaj
      </button>
    </>
  );
}
