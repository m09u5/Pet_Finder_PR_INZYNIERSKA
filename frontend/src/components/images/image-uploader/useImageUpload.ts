import { useState, type ChangeEvent } from "react";
import { useInvalidateOffers } from "@/hooks/useInvalidateOffers";
import { apiUpload, ApiError } from "@/lib/api";
import type { UseImageUploadResult } from "./image-uploader.types";

export function useImageUpload(uploadUrl: string): UseImageUploadResult {
  const invalidateOffers = useInvalidateOffers();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const files = input.files;
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("images", file));
      await apiUpload(uploadUrl, formData);
      await invalidateOffers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się przesłać zdjęć");
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  return { uploading, error, upload };
}
