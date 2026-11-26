import type { EmailVerificationToken, PasswordResetToken } from "@prisma/client";
import { prisma } from "../../config/prisma";
import type { NewToken, TokenRepository } from "../token.repository";

export class PrismaTokenRepository implements TokenRepository {
  async replaceEmailVerificationToken(token: NewToken) {
    await prisma.emailVerificationToken.deleteMany({ where: { userId: token.userId } });
    await prisma.emailVerificationToken.create({ data: token });
  }

  findEmailVerificationToken(tokenHash: string) {
    return prisma.emailVerificationToken.findUnique({ where: { tokenHash } });
  }

  async confirmEmail(token: EmailVerificationToken) {
    await prisma.$transaction([
      prisma.user.update({ where: { id: token.userId }, data: { emailVerified: true } }),
      prisma.emailVerificationToken.delete({ where: { id: token.id } }),
    ]);
  }

  async replacePasswordResetToken(token: NewToken) {
    await prisma.passwordResetToken.deleteMany({ where: { userId: token.userId, usedAt: null } });
    await prisma.passwordResetToken.create({ data: token });
  }

  findPasswordResetToken(tokenHash: string) {
    return prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  }

  async changePassword(token: PasswordResetToken, passwordHash: string) {
    await prisma.$transaction([
      prisma.user.update({ where: { id: token.userId }, data: { passwordHash } }),
      prisma.passwordResetToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
    ]);
  }
}
