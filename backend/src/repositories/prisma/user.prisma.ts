import { prisma } from "../../config/prisma";
import type { NewUser, UserRepository } from "../user.repository";

export class PrismaUserRepository implements UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  create({ breederProfile, ...user }: NewUser) {
    return prisma.user.create({
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        ...(breederProfile && {
          breederProfile: {
            create: {
              breedingName: breederProfile.breedingName,
              description: breederProfile.description,
              street: breederProfile.street,
              city: breederProfile.city,
              postalCode: breederProfile.postalCode,
            },
          },
        }),
      },
    });
  }
}
