import type { EmailVerificationToken, PasswordResetToken, User } from "@prisma/client";
import { BadRequestError, ConflictError, ForbiddenError, UnauthorizedError } from "../AppError";
import { comparePassword } from "../password";

export function assertEmailAvailable(existing: User | null) {
  if (existing) {
    throw new ConflictError("Konto z tym adresem e-mail już istnieje", "EMAIL_TAKEN");
  }
}

export async function requireValidCredentials(user: User | null, password: string): Promise<User> {
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new UnauthorizedError("Nieprawidłowy e-mail lub hasło", "INVALID_CREDENTIALS");
  }
  return user;
}

export function assertEmailVerified(user: User) {
  if (!user.emailVerified) {
    throw new ForbiddenError("Potwierdź adres e-mail, aby się zalogować", "EMAIL_NOT_VERIFIED");
  }
}

export function requireSessionUser(user: User | null): User {
  if (!user) {
    throw new UnauthorizedError("podany użytkownik nie istnieje", "NOT_AUTHENTICATED");
  }
  return user;
}

export function requireActiveVerificationToken(token: EmailVerificationToken | null): EmailVerificationToken {
  if (!token || token.expiresAt < new Date()) {
    throw new BadRequestError("Link weryfikacyjny jest nieprawidłowy lub wygasł", "INVALID_TOKEN");
  }
  return token;
}

export function requireActiveResetToken(token: PasswordResetToken | null): PasswordResetToken {
  if (!token || token.usedAt || token.expiresAt < new Date()) {
    throw new BadRequestError("Link resetu hasła jest nieprawidłowy lub wygasł", "INVALID_TOKEN");
  }
  return token;
}
