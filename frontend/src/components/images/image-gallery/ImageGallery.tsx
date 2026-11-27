"use client";

import clsx from "clsx";
import Image from "next/image";
import { ImageThumbnails } from "@/components/images/image-thumbnails/ImageThumbnails";
import { IconButton } from "@/components/ui/icon-button/IconButton";
import { TrashIcon } from "@/components/ui/icons/TrashIcon";
import type { ImageGalleryProps } from "./image-gallery.types";
import { useImageSlider } from "./useImageSlider";

const arrowClass = "absolute top-1/2 -translate-y-1/2 bg-white/80 text-gray-900 rounded-full w-8 h-8";

export function ImageGallery({ images, alt, variant, toolbar, onDeleteAction }: ImageGalleryProps) {
  const { index, current, hasMultiple, goTo } = useImageSlider(images);
  const canDeleteCurrent = onDeleteAction && current.id !== "placeholder";
  const isHero = variant === "hero";

  return (
    <div
      className={clsx(
        "relative w-full rounded-2xl overflow-hidden bg-gray-100",
        isHero ? "aspect-[4/3] lg:aspect-[16/15]" : "aspect-square",
      )}
    >
      <Image
        src={current.url}
        alt={alt}
        fill
        sizes={isHero ? "(min-width: 1024px) 750px, 100vw" : "(min-width: 640px) 224px, 100vw"}
        className="object-cover"
      />
      {(toolbar || canDeleteCurrent) && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          {toolbar}
          {canDeleteCurrent && (
            <IconButton label="Usuń zdjęcie" tone="danger" onClickAction={() => onDeleteAction(current.id)}>
              <TrashIcon />
            </IconButton>
          )}
        </div>
      )}
      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Poprzednie zdjęcie"
            onClick={() => goTo(index - 1)}
            className={clsx(arrowClass, "left-2")}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Następne zdjęcie"
            onClick={() => goTo(index + 1)}
            className={clsx(arrowClass, "right-2")}
          >
            ›
          </button>
        </>
      )}
      {isHero && hasMultiple && <ImageThumbnails images={images} activeIndex={index} onSelectAction={goTo} />}
    </div>
  );
}
