"use client";

import Image from "next/image";
import { ImageThumbnails } from "@/components/images/image-thumbnails/ImageThumbnails";
import type { ImageGalleryProps } from "./image-gallery.types";
import { useImageSlider } from "./useImageSlider";

export function ImageGallery({ images, alt, onDeleteAction }: ImageGalleryProps) {
  const { index, current, hasMultiple, goTo } = useImageSlider(images);
  const canDeleteCurrent = onDeleteAction && current.id !== "placeholder";

  return (
    <div>
      <div className="relative w-full h-72 rounded overflow-hidden bg-gray-100">
        <Image src={current.url} alt={alt} fill sizes="(max-width: 672px) 100vw, 672px" className="object-cover" />
        {canDeleteCurrent && (
          <button
            type="button"
            onClick={() => onDeleteAction(current.id)}
            className="absolute top-2 right-2 bg-white/90 text-red-600 text-xs px-2 py-1 rounded"
          >
            Usuń zdjęcie
          </button>
        )}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-900 rounded-full w-8 h-8"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-900 rounded-full w-8 h-8"
            >
              ›
            </button>
          </>
        )}
      </div>
      {hasMultiple && <ImageThumbnails images={images} activeIndex={index} onSelectAction={goTo} />}
    </div>
  );
}
