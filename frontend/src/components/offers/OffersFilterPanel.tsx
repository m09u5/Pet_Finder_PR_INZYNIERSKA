"use client";

import clsx from "clsx";
import { buttonClass, fieldClass } from "@/styles/theme";
import type { OffersFilterPanelProps } from "./offers-filter-panel.types";
import type { OffersSex, OffersSort } from "./offers-search.types";

const RADIUS_OPTIONS = [20, 50, 100, 200];

export function OffersFilterPanel({
  filters,
  hasLocation,
  locationMessage,
  onChangeAction,
  onLocationTextChangeAction,
  onUseMyLocationAction,
  onResetAction,
}: OffersFilterPanelProps) {
  return (
    <div className="mb-6 space-y-3 border border-gray-200 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Szukaj (nazwa hodowli, gatunek, rasa...)"
          className={clsx(fieldClass, "flex-1")}
          value={filters.q}
          onChange={(event) => onChangeAction("q", event.target.value)}
        />
        <div className="flex gap-2 flex-1">
          <input
            type="text"
            placeholder="Lokalizacja (miasto)"
            className={clsx(fieldClass, "flex-1")}
            value={filters.locationText}
            onChange={(event) => onLocationTextChangeAction(event.target.value)}
          />
          <button type="button" onClick={onUseMyLocationAction} className={buttonClass({ variant: "outline" })}>
            Użyj mojej lokalizacji
          </button>
        </div>
      </div>

      {locationMessage && <p className="text-sm text-gray-500">{locationMessage}</p>}
      {filters.lat !== null && filters.lng !== null && (
        <p className="text-sm text-gray-500">
          Lokalizacja ustawiona ({filters.lat.toFixed(3)}, {filters.lng.toFixed(3)})
        </p>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <select
          className={fieldClass}
          value={filters.radiusKm}
          disabled={!hasLocation}
          onChange={(event) => onChangeAction("radiusKm", event.target.value)}
        >
          <option value="">promień: dowolny</option>
          {RADIUS_OPTIONS.map((km) => (
            <option key={km} value={km}>
              do {km} km
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Gatunek"
          className={clsx(fieldClass, "w-32")}
          value={filters.species}
          onChange={(event) => onChangeAction("species", event.target.value)}
        />
        <input
          type="text"
          placeholder="Rasa"
          className={clsx(fieldClass, "w-32")}
          value={filters.breed}
          onChange={(event) => onChangeAction("breed", event.target.value)}
        />
        <select
          className={fieldClass}
          value={filters.sex}
          onChange={(event) => onChangeAction("sex", event.target.value as OffersSex)}
        >
          <option value="">płeć: dowolna</option>
          <option value="MALE">samiec</option>
          <option value="FEMALE">samica</option>
        </select>
        <input
          type="number"
          placeholder="Cena od"
          className={clsx(fieldClass, "w-28")}
          value={filters.minPrice}
          onChange={(event) => onChangeAction("minPrice", event.target.value)}
        />
        <input
          type="number"
          placeholder="Cena do"
          className={clsx(fieldClass, "w-28")}
          value={filters.maxPrice}
          onChange={(event) => onChangeAction("maxPrice", event.target.value)}
        />
        <select
          className={fieldClass}
          value={filters.sort}
          onChange={(event) => onChangeAction("sort", event.target.value as OffersSort)}
        >
          <option value="newest">sortuj: najnowsze</option>
          <option value="price_asc">cena rosnąco</option>
          <option value="price_desc">cena malejąco</option>
          <option value="distance" disabled={!hasLocation}>
            odległość
          </option>
        </select>

        <button type="button" onClick={onResetAction} className={buttonClass({ variant: "outline" })}>
          Wyczyść
        </button>
      </div>
    </div>
  );
}
