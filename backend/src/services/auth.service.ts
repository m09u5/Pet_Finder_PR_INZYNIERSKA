import type { RegisterInput } from "@pet-finder/shared";
import { prisma } from "../config/prisma";
import { ConflictError, ForbiddenError, UnauthorizedError, BadRequestError } from "../utils/AppError";
import { comparePassword, hashPassword } from "../utils/password";
import { generateToken, hashToken } from "../utils/token";
import { sendPasswordResetEmail, sendVerificationEmail } from "./email.service";
import { userRepository } from "../repositories/user.repository";

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

export async function registerUser(input: RegisterInput) {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    throw new ConflictError("Konto z tym adresem e-mail już istnieje", "EMAIL_TAKEN");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        role: input.role,
      },
    });

    if (input.role === "BREEDER") {
      await tx.breederProfile.create({
        data: {
          userId: created.id,
          breedingName: input.breederProfile.breedingName,
          description: input.breederProfile.description,
          street: input.breederProfile.street,
          city: input.breederProfile.city,
          postalCode: input.breederProfile.postalCode,
        },
      });
    }

    return created;
  });

  await issueEmailVerificationToken(user.id, user.email);

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await userRepository.findByEmail(email);


  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new UnauthorizedError("Nieprawidłowy e-mail lub hasło", "INVALID_CREDENTIALS");
  }

  if (!user.emailVerified) {
    throw new ForbiddenError("Potwierdź adres e-mail, aby się zalogować", "EMAIL_NOT_VERIFIED");
  }

  return user;
}

export function getUserById(id: string) {
  return userRepository.findById(id);
}

async function issueEmailVerificationToken(userId: string, email: string) {
  await prisma.emailVerificationToken.deleteMany({ where: { userId } });
  const { raw, hash } = generateToken();
  await prisma.emailVerificationToken.create({
    data: { userId, tokenHash: hash, expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS) },
  });
  await sendVerificationEmail(email, raw);
}

export async function verifyEmail(token: string) {
  const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash: hashToken(token) } });

  if (!record || record.expiresAt < new Date()) {
    throw new BadRequestError("Link weryfikacyjny jest nieprawidłowy lub wygasł", "INVALID_TOKEN");
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { emailVerified: true } }),
    prisma.emailVerificationToken.delete({ where: { id: record.id } }),
  ]);
}

export async function resendVerificationEmail(email: string) {
  const user = await userRepository.findByEmail(email);

  if (!user || user.emailVerified) return;
  await issueEmailVerificationToken(user.id, user.email);
}

export async function requestPasswordReset(email: string) {
  const user = await userRepository.findByEmail(email);
  if (!user) return;

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });
  const { raw, hash } = generateToken();
  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash: hash, expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS) },
  });
  await sendPasswordResetEmail(user.email, raw);
}

export async function resetPassword(token: string, newPassword: string) {
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) } });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw new BadRequestError("Link resetu hasła jest nieprawidłowy lub wygasł", "INVALID_TOKEN");
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);
}
