import { useEffect, useRef, useState } from "react";
import { MAX_IMAGE_COUNT } from "@pet-finder/shared";
import type { SelectedPhoto, UseSelectedPhotosResult } from "./animal-photo-picker.types";
import { getPhotoError, getPhotoLimitError } from "./animal-photo-picker.utils";

function releasePreviews(photos: SelectedPhoto[]) {
  photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
}

export function useSelectedPhotos(): UseSelectedPhotosResult {
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photosRef = useRef<SelectedPhoto[]>([]);

  useEffect(() => () => releasePreviews(photosRef.current), []);

  function replacePhotos(next: SelectedPhoto[]) {
    photosRef.current = next;
    setPhotos(next);
  }

  function addPhotos(files: File[]) {
    const valid = files.filter((file) => getPhotoError(file) === null);
    const accepted = valid.slice(0, MAX_IMAGE_COUNT - photosRef.current.length);
    const rejectionError = files.map(getPhotoError).find((message) => message !== null);

    setPhotoError(rejectionError ?? getPhotoLimitError(photosRef.current.length + valid.length));
    replacePhotos([
      ...photosRef.current,
      ...accepted.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    ]);
  }

  function removePhoto(previewUrl: string) {
    releasePreviews(photosRef.current.filter((photo) => photo.previewUrl === previewUrl));
    setPhotoError(null);
    replacePhotos(photosRef.current.filter((photo) => photo.previewUrl !== previewUrl));
  }

  function clearPhotos() {
    releasePreviews(photosRef.current);
    setPhotoError(null);
    replacePhotos([]);
  }

  return { photos, photoError, addPhotos, removePhoto, clearPhotos };
}
