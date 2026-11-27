"use client";

import { ImageGallery } from "@/components/images/image-gallery/ImageGallery";
import { ImageUploader } from "@/components/images/image-uploader/ImageUploader";
import { useDeleteImage } from "@/hooks/useDeleteImage";
import type { EditableGalleryProps } from "./editable-gallery.types";

export function EditableGallery({
  images,
  alt,
  variant,
  editable,
  uploadUrl,
  deletable = true,
  minImages = 0,
}: EditableGalleryProps) {
  const deleteImage = useDeleteImage();
  const canDelete = editable && deletable && images.length > minImages;

  return (
    <ImageGallery
      images={images}
      alt={alt}
      variant={variant}
      toolbar={editable ? <ImageUploader uploadUrl={uploadUrl} /> : undefined}
      onDeleteAction={canDelete ? deleteImage : undefined}
    />
  );
}
