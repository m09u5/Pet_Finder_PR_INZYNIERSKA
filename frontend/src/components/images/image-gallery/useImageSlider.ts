import { useState } from "react";
import type { PublicImage } from "@pet-finder/shared";
import type { UseImageSliderResult } from "./image-gallery.types";

export function useImageSlider(images: PublicImage[]): UseImageSliderResult {
  const [index, setIndex] = useState(0);

  function goTo(nextIndex: number) {
    setIndex((nextIndex + images.length) % images.length);
  }

  return { index, current: images[index] ?? images[0], hasMultiple: images.length > 1, goTo };
}
