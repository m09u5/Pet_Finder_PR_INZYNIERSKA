"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const RADIUS_OPTIONS = [20, 50, 100, 200];

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [q, setQ] = useState("");
  const [locationText, setLocationText] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [radiusKm, setRadiusKm] = useState("50");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (species) params.set("species", species);
    if (breed) params.set("breed", breed);
    if (sex) params.set("sex", sex);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (locationText.trim()) {
      params.set("locationText", locationText.trim());
      params.set("radiusKm", radiusKm);
    }
    setFiltersOpen(false);
    router.push(`/offers?${params.toString()}`);
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <Link href="/" className="font-semibold text-lg text-gray-900 whitespace-nowrap">
          Pet Finder
        </Link>

        <div ref={containerRef} className="relative flex-1 min-w-[260px] max-w-2xl">
          <form
            onSubmit={handleSearch}
            className="flex items-center border border-gray-300 rounded-full bg-gray-50 overflow-hidden"
          >
            <input
              type="text"
              placeholder="Szukaj pupila"
              value={q}
              onFocus={() => setFiltersOpen(true)}
              onChange={(event) => setQ(event.target.value)}
              className="flex-1 min-w-0 bg-transparent px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            <div className="w-px h-6 bg-gray-300" />
            <input
              type="text"
              placeholder="Lokalizacja"
              value={locationText}
              onFocus={() => setFiltersOpen(true)}
              onChange={(event) => setLocationText(event.target.value)}
              className="flex-1 min-w-0 bg-transparent px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 m-1 rounded-full whitespace-nowrap"
            >
              <SearchIcon />
              Szukaj
            </button>
          </form>

          {filtersOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20 text-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Gatunek"
                  value={species}
                  onChange={(event) => setSpecies(event.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900"
                />
                <input
                  type="text"
                  placeholder="Rasa"
                  value={breed}
                  onChange={(event) => setBreed(event.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900"
                />
                <select
                  value={sex}
                  onChange={(event) => setSex(event.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900"
                >
                  <option value="">Płeć: dowolna</option>
                  <option value="MALE">Samiec</option>
                  <option value="FEMALE">Samica</option>
                </select>
                <input
                  type="number"
                  placeholder="Cena od"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900"
                />
                <input
                  type="number"
                  placeholder="Cena do"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900"
                />
                <select
                  value={radiusKm}
                  onChange={(event) => setRadiusKm(event.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900"
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
                onClick={handleSearch}
                className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 rounded-full"
              >
                Szukaj
              </button>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4 whitespace-nowrap text-sm">
          {loading ? null : user ? (
            <>
              {(user.role === "CUSTOMER" || user.role === "BREEDER") && (
                <Link href="/messages" className="text-gray-700 hover:text-gray-900">
                  Wiadomości
                </Link>
              )}
              {user.role === "CUSTOMER" && (
                <Link href="/reservations" className="text-gray-700 hover:text-gray-900">
                  Moje rezerwacje
                </Link>
              )}
              {user.role === "BREEDER" && (
                <Link href="/breeder/reservations" className="text-gray-700 hover:text-gray-900">
                  Rezerwacje
                </Link>
              )}
              {user.role === "ADMIN" && (
                <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                  Panel admina
                </Link>
              )}
              <Link href="/profile" className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900">
                <PersonIcon />
                Moje konto
              </Link>
              <button
                onClick={logout}
                className="border border-gray-300 px-3 py-1.5 rounded-full text-gray-700 hover:bg-gray-50"
              >
                Wyloguj
              </button>
              {user.role === "BREEDER" && (
                <Link
                  href="/breeder/offers"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-full"
                >
                  Moja hodowla
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900">
                <PersonIcon />
                Logowanie/Rejestracja
              </Link>
              <Link
                href="/register"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-full whitespace-nowrap"
              >
                Zostań Hodowcą
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
