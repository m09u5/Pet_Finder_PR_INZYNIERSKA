import type { PublicImage } from "@pet-finder/shared";
import type { ImageGalleryVariant } from "@/components/images/image-gallery/image-gallery.types";

export interface EditableGalleryProps {
  images: PublicImage[];
  alt: string;
  variant: ImageGalleryVariant;
  editable: boolean;
  deletable?: boolean;
  uploadUrl: string;
  minImages?: number;
}
