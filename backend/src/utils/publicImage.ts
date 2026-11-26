import type { Image } from "@prisma/client";
import type { PublicImage } from "@pet-finder/shared";

export function toPublicImage(image: Pick<Image, "id" | "url">): PublicImage {
  return { id: image.id, url: image.url };
}
