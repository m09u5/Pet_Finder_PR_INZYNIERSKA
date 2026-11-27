import { prisma } from "../../config/prisma";
import type { ImageRepository, NewImage } from "../image.repository";

export class PrismaImageRepository implements ImageRepository {
  findByIdWithOwner(id: string) {
    return prisma.image.findUnique({
      where: { id },
      include: { offer: true, animal: { include: { offer: true } } },
    });
  }

  countByAnimalId(animalId: string) {
    return prisma.image.count({ where: { animalId } });
  }

  createMany(images: NewImage[]) {
    return prisma.$transaction(images.map((image) => prisma.image.create({ data: image })));
  }

  async delete(id: string) {
    await prisma.image.delete({ where: { id } });
  }
}
