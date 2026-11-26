import { prisma } from "../../config/prisma";
import type { ImageRepository, NewImage } from "../image.repository";

export class PrismaImageRepository implements ImageRepository {
  findByIdWithOwner(id: string) {
    return prisma.image.findUnique({
      where: { id },
      include: { offer: true, animal: { include: { offer: true } } },
    });
  }

  create(image: NewImage) {
    return prisma.image.create({ data: image });
  }

  async delete(id: string) {
    await prisma.image.delete({ where: { id } });
  }
}
