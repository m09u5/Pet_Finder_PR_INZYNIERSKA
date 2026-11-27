import { useState } from "react";
import { useInvalidateBreeder } from "@/hooks/useInvalidateBreeder";
import { apiFetch, apiUpload, ApiError } from "@/lib/api";
import type { UseBreederLogoResult } from "./breeder-logo.types";

const LOGO_URL = "/api/breeders/me/logo";

export function useBreederLogo(): UseBreederLogoResult {
  const invalidateBreeder = useInvalidateBreeder();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function change(request: () => Promise<unknown>, fallbackMessage: string) {
    setError(null);
    setSaving(true);
    try {
      await request();
      await invalidateBreeder();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : fallbackMessage);
    } finally {
      setSaving(false);
    }
  }

  function upload([file]: File[]) {
    const formData = new FormData();
    formData.append("logo", file);
    return change(() => apiUpload(LOGO_URL, formData), "Nie udało się przesłać logo");
  }

  function remove() {
    return change(() => apiFetch(LOGO_URL, { method: "DELETE" }), "Nie udało się usunąć logo");
  }

  return { saving, error, upload, remove };
}
