import type { EmailVerificationToken, PasswordResetToken } from "@prisma/client";

export interface NewToken {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface TokenRepository {
  replaceEmailVerificationToken(token: NewToken): Promise<void>;
  findEmailVerificationToken(tokenHash: string): Promise<EmailVerificationToken | null>;
  confirmEmail(token: EmailVerificationToken): Promise<void>;
  replacePasswordResetToken(token: NewToken): Promise<void>;
  findPasswordResetToken(tokenHash: string): Promise<PasswordResetToken | null>;
  changePassword(token: PasswordResetToken, passwordHash: string): Promise<void>;
}
