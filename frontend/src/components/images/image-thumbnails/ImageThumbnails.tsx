import clsx from "clsx";
import Image from "next/image";
import type { ImageThumbnailsProps } from "./image-thumbnails.types";

export function ImageThumbnails({ images, activeIndex, onSelectAction }: ImageThumbnailsProps) {
  return (
    <div className="absolute inset-x-0 bottom-3 px-3 flex overflow-x-auto">
      <div className="flex gap-3 mx-auto">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            aria-label={`Pokaż zdjęcie ${index + 1}`}
            onClick={() => onSelectAction(index)}
            className={clsx(
              "relative w-20 h-16 sm:w-36 sm:h-28 shrink-0 overflow-hidden border-2",
              index === activeIndex ? "border-white" : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <Image src={image.url} alt="" fill sizes="144px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
