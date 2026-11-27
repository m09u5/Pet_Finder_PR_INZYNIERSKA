import type { VerificationStatus } from "@pet-finder/shared";
import { prisma } from "../../config/prisma";
import type { BreederListParams, BreederRepository, Coordinates } from "../breeder.repository";
import type { StoredImage } from "../image.repository";

const ownerSelect = { id: true, email: true, firstName: true, lastName: true } as const;

export class PrismaBreederRepository implements BreederRepository {
  list(params: BreederListParams) {
    return prisma.breederProfile.findMany({
      where: params.status ? { verificationStatus: params.status } : undefined,
      include: { user: { select: ownerSelect } },
      orderBy: { createdAt: "asc" },
      skip: params.skip,
      take: params.take,
    });
  }

  count(status?: VerificationStatus) {
    return prisma.breederProfile.count({ where: status ? { verificationStatus: status } : undefined });
  }

  findById(id: string) {
    return prisma.breederProfile.findUnique({ where: { id } });
  }

  findByUserId(userId: string) {
    return prisma.breederProfile.findUnique({ where: { userId } });
  }

  updateVerificationStatus(id: string, status: VerificationStatus) {
    return prisma.breederProfile.update({
      where: { id },
      data: { verificationStatus: status },
      include: { user: { select: ownerSelect } },
    });
  }

  updateProfile(id: string, data: { description?: string }) {
    return prisma.breederProfile.update({ where: { id }, data });
  }

  updateLogo(id: string, logo: StoredImage | null) {
    return prisma.breederProfile.update({
      where: { id },
      data: { logoUrl: logo?.url ?? null, logoStoragePath: logo?.storagePath ?? null },
    });
  }

  updateCoordinates(userId: string, coordinates: Coordinates) {
    return prisma.breederProfile.update({ where: { userId }, data: coordinates });
  }
}
