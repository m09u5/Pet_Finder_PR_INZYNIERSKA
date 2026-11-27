"use client";

import { CameraIcon } from "@/components/ui/icons/CameraIcon";
import { IconUploadButton } from "@/components/ui/icon-upload-button/IconUploadButton";
import { floatingMessageClass } from "@/styles/theme";
import type { ImageUploaderProps } from "./image-uploader.types";
import { useImageUpload } from "./useImageUpload";

export function ImageUploader({ uploadUrl }: ImageUploaderProps) {
  const { uploading, error, upload } = useImageUpload(uploadUrl);

  return (
    <div className="relative">
      <IconUploadButton label="Dodaj zdjęcia" multiple disabled={uploading} onSelectAction={upload}>
        <CameraIcon />
      </IconUploadButton>
      {uploading && <p className={floatingMessageClass()}>Przesyłanie...</p>}
      {error && <p className={floatingMessageClass("text-red-600")}>{error}</p>}
    </div>
  );
}
