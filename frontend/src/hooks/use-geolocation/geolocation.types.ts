export interface GeolocationCoords {
  lat: number;
  lng: number;
}

export type GeolocationStatus = "idle" | "loading" | "granted" | "denied" | "unsupported";

export interface UseGeolocationOptions {
  auto?: boolean;
}

export interface UseGeolocationResult {
  coords: GeolocationCoords | null;
  status: GeolocationStatus;
  request: () => Promise<GeolocationCoords>;
  reset: () => void;
}
