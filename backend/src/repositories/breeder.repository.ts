import type { VerificationStatus } from "@pet-finder/shared";
import { prisma } from "../config/prisma";

const ownerSelect = { id: true, email: true, firstName: true, lastName: true } as const;

export const breederRepository = {
  list(params: { status?: VerificationStatus; skip: number; take: number }) {
    return prisma.breederProfile.findMany({
      where: params.status ? { verificationStatus: params.status } : undefined,
      include: { user: { select: ownerSelect } },
      orderBy: { createdAt: "asc" },
      skip: params.skip,
      take: params.take,
    });
  },
  count(status?: VerificationStatus) {
    return prisma.breederProfile.count({ where: status ? { verificationStatus: status } : undefined });
  },
  findById(id: string) {
    return prisma.breederProfile.findUnique({ where: { id } });
  },
  updateVerificationStatus(id: string, status: VerificationStatus) {
    return prisma.breederProfile.update({
      where: { id },
      data: { verificationStatus: status },
      include: { user: { select: ownerSelect } },
    });
  },
};
