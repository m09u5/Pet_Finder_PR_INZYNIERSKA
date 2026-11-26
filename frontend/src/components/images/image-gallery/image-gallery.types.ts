import type { PublicImage } from "@pet-finder/shared";

export interface ImageGalleryProps {
  images: PublicImage[];
  alt: string;
  onDeleteAction?: (imageId: string) => void;
}

export interface UseImageSliderResult {
  index: number;
  current: PublicImage;
  hasMultiple: boolean;
  goTo: (index: number) => void;
}
