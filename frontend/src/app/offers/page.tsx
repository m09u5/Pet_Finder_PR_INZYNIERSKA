"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import type { PublicOfferSearchResult } from "@pet-finder/shared";
import { apiFetch } from "@/lib/api";
import { STATIC_BREEDER_RATING } from "@/lib/staticRating";

const RADIUS_OPTIONS = [20, 50, 100, 200];

interface Filters {
  q: string;
  species: string;
  breed: string;
  sex: "" | "MALE" | "FEMALE";
  minPrice: string;
  maxPrice: string;
  locationText: string;
  lat: number | null;
  lng: number | null;
  radiusKm: string;
  sort: "newest" | "price_asc" | "price_desc" | "distance";
}

const emptyFilters: Filters = {
  q: "",
  species: "",
  breed: "",
  sex: "",
  minPrice: "",
  maxPrice: "",
  locationText: "",
  lat: null,
  lng: null,
  radiusKm: "",
  sort: "newest",
};

function buildQueryString(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.species) params.set("species", filters.species);
  if (filters.breed) params.set("breed", filters.breed);
  if (filters.sex) params.set("sex", filters.sex);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  const hasLocation = (filters.lat !== null && filters.lng !== null) || filters.locationText.trim().length > 0;
  if (hasLocation && filters.radiusKm) {
    params.set("radiusKm", filters.radiusKm);
    if (filters.lat !== null && filters.lng !== null) {
      params.set("lat", String(filters.lat));
      params.set("lng", String(filters.lng));
    } else {
      params.set("locationText", filters.locationText.trim());
    }
  }
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  return params.toString();
}

export default function OffersPage() {
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [applied, setApplied] = useState<Filters>(emptyFilters);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const hasLocation = (draft.lat !== null && draft.lng !== null) || draft.locationText.trim().length > 0;

  const { data, isLoading, error } = useQuery({
    queryKey: ["offers", applied],
    queryFn: () => apiFetch<{ items: PublicOfferSearchResult[] }>(`/api/offers?${buildQueryString(applied)}`),
  });

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Przeglądarka nie obsługuje geolokalizacji");
      return;
    }
    setLocationStatus("Pobieranie lokalizacji...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDraft((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          locationText: "",
          radiusKm: prev.radiusKm || "50",
        }));
        setLocationStatus(null);
      },
      () => {
        setLocationStatus("Nie udało się pobrać lokalizacji");
      },
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setApplied(draft);
  }

  function handleReset() {
    setDraft(emptyFilters);
    setApplied(emptyFilters);
    setLocationStatus(null);
  }

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="mb-6 space-y-3 border rounded p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Szukaj (nazwa hodowli, gatunek, rasa...)"
            className="border rounded px-3 py-2 flex-1"
            value={draft.q}
            onChange={(e) => setDraft((prev) => ({ ...prev, q: e.target.value }))}
          />
          <div className="flex gap-2 flex-1">
            <input
              type="text"
              placeholder="Lokalizacja (miasto)"
              className="border rounded px-3 py-2 flex-1"
              value={draft.locationText}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, locationText: e.target.value, lat: null, lng: null }))
              }
            />
            <button type="button" onClick={useMyLocation} className="border rounded px-3 py-2 whitespace-nowrap">
              Użyj mojej lokalizacji
            </button>
          </div>
        </div>

        {locationStatus && <p className="text-sm text-gray-500">{locationStatus}</p>}
        {draft.lat !== null && draft.lng !== null && (
          <p className="text-sm text-gray-500">Lokalizacja ustawiona ({draft.lat.toFixed(3)}, {draft.lng.toFixed(3)})</p>
        )}

        <div className="flex flex-wrap gap-2 items-center">
          <select
            className="border rounded px-3 py-2"
            value={draft.radiusKm}
            disabled={!hasLocation}
            onChange={(e) => setDraft((prev) => ({ ...prev, radiusKm: e.target.value }))}
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
            className="border rounded px-3 py-2 w-32"
            value={draft.species}
            onChange={(e) => setDraft((prev) => ({ ...prev, species: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Rasa"
            className="border rounded px-3 py-2 w-32"
            value={draft.breed}
            onChange={(e) => setDraft((prev) => ({ ...prev, breed: e.target.value }))}
          />
          <select
            className="border rounded px-3 py-2"
            value={draft.sex}
            onChange={(e) => setDraft((prev) => ({ ...prev, sex: e.target.value as Filters["sex"] }))}
          >
            <option value="">płeć: dowolna</option>
            <option value="MALE">samiec</option>
            <option value="FEMALE">samica</option>
          </select>
          <input
            type="number"
            placeholder="Cena od"
            className="border rounded px-3 py-2 w-28"
            value={draft.minPrice}
            onChange={(e) => setDraft((prev) => ({ ...prev, minPrice: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Cena do"
            className="border rounded px-3 py-2 w-28"
            value={draft.maxPrice}
            onChange={(e) => setDraft((prev) => ({ ...prev, maxPrice: e.target.value }))}
          />
          <select
            className="border rounded px-3 py-2"
            value={draft.sort}
            onChange={(e) => setDraft((prev) => ({ ...prev, sort: e.target.value as Filters["sort"] }))}
          >
            <option value="newest">sortuj: najnowsze</option>
            <option value="price_asc">cena rosnąco</option>
            <option value="price_desc">cena malejąco</option>
            <option value="distance" disabled={!hasLocation}>
              odległość
            </option>
          </select>

          <button type="submit" className="border rounded px-4 py-2 bg-gray-900 text-white">
            Szukaj
          </button>
          <button type="button" onClick={handleReset} className="border rounded px-4 py-2">
            Wyczyść
          </button>
        </div>
      </form>

      {isLoading && <p>Ładowanie...</p>}
      {error && <p className="text-red-600">Nie udało się pobrać ogłoszeń.</p>}
      {!isLoading && !error && !data?.items.length && <p>Brak ogłoszeń spełniających kryteria.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data?.items.map((offer) => (
          <Link key={offer.id} href={`/offers/${offer.id}`} className="border rounded overflow-hidden block hover:shadow">
            <div className="relative w-full h-40 bg-gray-100">
              <Image
                src={offer.images[0].url}
                alt={offer.breeder.breedingName}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
              <span className="absolute top-2 left-2 bg-white/90 text-sm px-2 py-1 rounded">
                {offer.breeder.breedingName}
              </span>
            </div>
            <div className="p-3">
              <p className="text-sm text-gray-500 mb-1">
                ★ {STATIC_BREEDER_RATING} · {offer.breeder.city}
                {offer.distanceKm !== null && ` · ${offer.distanceKm.toFixed(0)} km od Ciebie`}
              </p>
              <p className="font-medium">{offer.title}</p>
              <p className="text-sm text-gray-500">
                {offer.animals.length} {offer.animals.length === 1 ? "zwierzę dostępne" : "zwierząt dostępnych"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
