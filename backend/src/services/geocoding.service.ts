import { env } from "../config/env";

export interface GeocodeResult {
  latitude: number;
  longitude: number;
}

interface NominatimEntry {
  lat: string;
  lon: string;
}

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
const cache = new Map<string, GeocodeResult | null>();

export function parseNominatimResponse(results: NominatimEntry[]): GeocodeResult | null {
  const first = results[0];
  if (!first) return null;
  const latitude = Number(first.lat);
  const longitude = Number(first.lon);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
  return { latitude, longitude };
}

export async function geocodeQuery(query: string): Promise<GeocodeResult | null> {
  if (env.NODE_ENV === "test") return null;

  const key = query.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key)!;

  const url = new URL(NOMINATIM_SEARCH_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  try {
    const response = await fetch(url, { headers: { "User-Agent": env.NOMINATIM_USER_AGENT } });
    const result = response.ok ? parseNominatimResponse((await response.json()) as NominatimEntry[]) : null;
    cache.set(key, result);
    return result;
  } catch {
    cache.set(key, null);
    return null;
  }
}

export function geocodeAddress(street: string, city: string, postalCode: string): Promise<GeocodeResult | null> {
  return geocodeQuery(`${street}, ${postalCode} ${city}, Polska`);
}
