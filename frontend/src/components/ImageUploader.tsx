"use client";

import { useState, type ChangeEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiUpload, ApiError } from "@/lib/api";

export function ImageUploader({ uploadUrl }: { uploadUrl: string }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("images", file));
      await apiUpload(uploadUrl, formData);
      await queryClient.invalidateQueries({ queryKey: ["offer"] });
      await queryClient.invalidateQueries({ queryKey: ["my-offer"] });
      await queryClient.invalidateQueries({ queryKey: ["offers"] });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się przesłać zdjęć");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="mt-2">
      <label className="inline-block border px-3 py-1.5 rounded text-sm cursor-pointer">
        {uploading ? "Przesyłanie..." : "Dodaj zdjęcia"}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
