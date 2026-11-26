"use client";

import { ImageGallery } from "@/components/images/image-gallery/ImageGallery";
import { ImageUploader } from "@/components/images/image-uploader/ImageUploader";
import { useDeleteImage } from "@/hooks/useDeleteImage";
import type { EditableGalleryProps } from "./editable-gallery.types";

export function EditableGallery({ images, alt, editable, uploadUrl }: EditableGalleryProps) {
  const deleteImage = useDeleteImage();

  return (
    <>
      <ImageGallery images={images} alt={alt} onDeleteAction={editable ? deleteImage : undefined} />
      {editable && <ImageUploader uploadUrl={uploadUrl} />}
    </>
  );
}
