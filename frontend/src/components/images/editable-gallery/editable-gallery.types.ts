import type { PublicImage } from "@pet-finder/shared";

export interface EditableGalleryProps {
  images: PublicImage[];
  alt: string;
  editable: boolean;
  uploadUrl: string;
  minImages?: number;
}
