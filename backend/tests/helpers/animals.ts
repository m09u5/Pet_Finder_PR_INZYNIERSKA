import type { SuperAgentTest } from "supertest";
import { prisma } from "../../src/config/prisma";
import { deleteImage } from "../../src/services/storage.service";

export const JPEG_BYTES = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);

export function postAnimal(agent: SuperAgentTest, animal: object) {
  return agent.post("/api/offers").field("animal", JSON.stringify(animal)).attach("images", JPEG_BYTES, "animal.jpg");
}

export async function removeUploadedFiles(emails: string[]) {
  const testBreeder = { breeder: { user: { email: { in: emails } } } };
  const images = await prisma.image.findMany({
    where: { OR: [{ offer: testBreeder }, { animal: testBreeder }] },
  });
  const breeders = await prisma.breederProfile.findMany({ where: { user: { email: { in: emails } } } });
  const logoPaths = breeders.flatMap((breeder) => breeder.logoStoragePath ?? []);

  await Promise.all([...images.map((image) => image.storagePath), ...logoPaths].map(deleteImage));
}
