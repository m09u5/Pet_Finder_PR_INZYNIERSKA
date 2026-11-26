import clsx from "clsx";
import Image from "next/image";
import type { ImageThumbnailsProps } from "./image-thumbnails.types";

export function ImageThumbnails({ images, activeIndex, onSelectAction }: ImageThumbnailsProps) {
  return (
    <div className="flex gap-2 mt-2">
      {images.map((image, index) => (
        <button
          key={image.id}
          type="button"
          onClick={() => onSelectAction(index)}
          className={clsx(
            "relative w-16 h-16 rounded overflow-hidden border-2",
            index === activeIndex ? "border-emerald-600" : "border-transparent",
          )}
        >
          <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
        </button>
      ))}
    </div>
  );
}
