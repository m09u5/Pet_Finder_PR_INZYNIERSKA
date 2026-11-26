"use client";

import clsx from "clsx";
import { buttonClass, errorTextClass } from "@/styles/theme";
import type { ImageUploaderProps } from "./image-uploader.types";
import { useImageUpload } from "./useImageUpload";

export function ImageUploader({ uploadUrl }: ImageUploaderProps) {
  const { uploading, error, upload } = useImageUpload(uploadUrl);

  return (
    <div className="mt-2">
      <label className={buttonClass({ variant: "outline", size: "sm", className: "cursor-pointer" })}>
        {uploading ? "Przesyłanie..." : "Dodaj zdjęcia"}
        <input type="file" accept="image/*" multiple onChange={upload} disabled={uploading} className="hidden" />
      </label>
      {error && <p className={clsx(errorTextClass, "mt-1")}>{error}</p>}
    </div>
  );
}
