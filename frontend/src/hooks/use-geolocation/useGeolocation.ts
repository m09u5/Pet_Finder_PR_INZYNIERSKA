import { useCallback, useEffect, useState } from "react";
import type {
  GeolocationCoords,
  GeolocationStatus,
  UseGeolocationOptions,
  UseGeolocationResult,
} from "./geolocation.types";

export function useGeolocation({ auto = false }: UseGeolocationOptions = {}): UseGeolocationResult {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>("idle");

  const request = useCallback(
    () =>
      new Promise<GeolocationCoords>((resolve, reject) => {
        if (!navigator.geolocation) {
          setStatus("unsupported");
          reject(new Error("Geolocation is not supported"));
          return;
        }
        setStatus("loading");
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const result = { lat: position.coords.latitude, lng: position.coords.longitude };
            setCoords(result);
            setStatus("granted");
            resolve(result);
          },
          (error) => {
            setStatus("denied");
            reject(error);
          },
        );
      }),
    [],
  );

  const reset = useCallback(() => {
    setCoords(null);
    setStatus("idle");
  }, []);

  useEffect(() => {
    if (!auto) return;
    queueMicrotask(() => {
      request().catch(() => undefined);
    });
  }, [auto, request]);

  return { coords, status, request, reset };
}
