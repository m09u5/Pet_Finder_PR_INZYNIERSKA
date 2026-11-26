import type { PublicImage } from "@pet-finder/shared";

export interface ImageThumbnailsProps {
  images: PublicImage[];
  activeIndex: number;
  onSelectAction: (index: number) => void;
}
