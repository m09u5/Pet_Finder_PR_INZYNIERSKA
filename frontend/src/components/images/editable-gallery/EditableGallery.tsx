"use client";

import { ImageGallery } from "@/components/images/image-gallery/ImageGallery";
import { ImageUploader } from "@/components/images/image-uploader/ImageUploader";
import { useDeleteImage } from "@/hooks/useDeleteImage";
import type { EditableGalleryProps } from "./editable-gallery.types";

export function EditableGallery({ images, alt, editable, uploadUrl, minImages = 0 }: EditableGalleryProps) {
  const deleteImage = useDeleteImage();
  const canDelete = editable && images.length > minImages;

  return (
    <>
      <ImageGallery images={images} alt={alt} onDeleteAction={canDelete ? deleteImage : undefined} />
      {editable && <ImageUploader uploadUrl={uploadUrl} />}
    </>
  );
}
