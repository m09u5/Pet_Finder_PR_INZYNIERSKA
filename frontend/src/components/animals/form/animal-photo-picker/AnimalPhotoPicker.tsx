"use client";

import Image from "next/image";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_COUNT } from "@pet-finder/shared";
import { buttonClass, mutedTextClass } from "@/styles/theme";
import type { AnimalPhotoPickerProps } from "./animal-photo-picker.types";

export function AnimalPhotoPicker({ photos, disabled, onAddAction, onRemoveAction }: AnimalPhotoPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className={mutedTextClass}>Zdjęcia zwierzęcia (wymagane co najmniej jedno, maksymalnie {MAX_IMAGE_COUNT})</p>

      {photos.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {photos.map((photo) => (
            <li key={photo.previewUrl} className="relative w-24 h-24 rounded overflow-hidden bg-gray-100">
              <Image src={photo.previewUrl} alt={photo.file.name} fill unoptimized className="object-cover" />
              <button
                type="button"
                onClick={() => onRemoveAction(photo.previewUrl)}
                disabled={disabled}
                className="absolute top-1 right-1 bg-white/90 text-red-600 text-xs px-2 py-0.5 rounded"
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className={buttonClass({ variant: "outline", size: "sm", className: "cursor-pointer self-start" })}>
        Wybierz zdjęcia
        <input
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          multiple
          disabled={disabled}
          className="hidden"
          onChange={(event) => {
            onAddAction(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
