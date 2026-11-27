import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_COUNT, MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from "@pet-finder/shared";

export function getPhotoError(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `Plik "${file.name}" nie jest obsługiwanym obrazem (JPEG, PNG, WEBP lub GIF)`;
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `Plik "${file.name}" jest zbyt duży (maksymalnie ${MAX_IMAGE_SIZE_MB} MB)`;
  }
  return null;
}

export function getPhotoLimitError(count: number) {
  return count > MAX_IMAGE_COUNT ? `Możesz dodać maksymalnie ${MAX_IMAGE_COUNT} zdjęć` : null;
}
