import type { ReactNode } from "react";
import type { PublicImage } from "@pet-finder/shared";

export type ImageGalleryVariant = "hero" | "square";

export interface ImageGalleryProps {
  images: PublicImage[];
  alt: string;
  variant: ImageGalleryVariant;
  toolbar?: ReactNode;
  onDeleteAction?: (imageId: string) => void;
}

export interface UseImageSliderResult {
  index: number;
  current: PublicImage;
  hasMultiple: boolean;
  goTo: (index: number) => void;
}
