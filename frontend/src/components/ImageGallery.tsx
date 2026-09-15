"use client";

import { useState } from "react";
import Image from "next/image";
import type { PublicImage } from "@pet-finder/shared";

export function ImageGallery({
  images,
  alt,
  onDeleteAction,
}: {
  images: PublicImage[];
  alt: string;
  onDeleteAction?: (imageId: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;
  const current = images[index] ?? images[0];
  const canDeleteCurrent = onDeleteAction && current.id !== "placeholder";

  function goTo(nextIndex: number) {
    setIndex((nextIndex + images.length) % images.length);
  }

  return (
    <div>
      <div className="relative w-full h-72 rounded overflow-hidden bg-gray-100">
        <Image src={current.url} alt={alt} fill sizes="(max-width: 672px) 100vw, 672px" className="object-cover" />
        {canDeleteCurrent && (
          <button
            type="button"
            onClick={() => onDeleteAction!(current.id)}
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-8 h-8"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-8 h-8"
            >
              ›
            </button>
          </>
        )}
      </div>
      {hasMultiple && (
        <div className="flex gap-2 mt-2">
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => goTo(i)}
              className={`relative w-16 h-16 rounded overflow-hidden border ${i === index ? "border-black" : "border-transparent"}`}
            >
              <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
