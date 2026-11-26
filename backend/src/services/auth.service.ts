import type { RegisterInput } from "@pet-finder/shared";
import { breederRepository, tokenRepository, userRepository } from "../config/repositories";
import { hashPassword } from "../utils/password";
import { readRefreshToken } from "../utils/jwt";
import { createSessionTokens } from "../utils/sessionTokens";
import { generateToken, hashToken } from "../utils/token";
import {
  assertEmailAvailable,
  assertEmailVerified,
  requireActiveResetToken,
  requireActiveVerificationToken,
  requireSessionUser,
  requireValidCredentials,
} from "../utils/validators/auth.validators";
import { requireFound } from "../utils/validators/found.validators";
import { sendPasswordResetEmail, sendVerificationEmail } from "./email.service";
import { geocodeAddress } from "./geocoding.service";

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

export async function registerUser(input: RegisterInput) {
  assertEmailAvailable(await userRepository.findByEmail(input.email));

  const user = await userRepository.create({
    email: input.email,
    passwordHash: await hashPassword(input.password),
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    role: input.role,
    breederProfile: input.role === "BREEDER" ? input.breederProfile : undefined,
  });

  if (input.role === "BREEDER") {
    const { street, city, postalCode } = input.breederProfile;
    const coordinates = await geocodeAddress(street, city, postalCode);
    if (coordinates) {
      await breederRepository.updateCoordinates(user.id, coordinates);
    }
  }

  await issueEmailVerificationToken(user.id, user.email);

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await requireValidCredentials(await userRepository.findByEmail(email), password);
  assertEmailVerified(user);
  return { user, tokens: createSessionTokens(user) };
}

export async function refreshSession(refreshToken: string | undefined) {
  const { sub } = readRefreshToken(refreshToken);
  const user = requireSessionUser(await userRepository.findById(sub));
  return { user, tokens: createSessionTokens(user) };
}

export async function getUserById(id: string) {
  return requireFound(await userRepository.findById(id), "Uzytkonik o podanym mailu nie istnieje");
}

export async function verifyEmail(token: string) {
  const record = requireActiveVerificationToken(await tokenRepository.findEmailVerificationToken(hashToken(token)));
  await tokenRepository.confirmEmail(record);
}

export async function resendVerificationEmail(email: string) {
  const user = await userRepository.findByEmail(email);
  if (!user || user.emailVerified) return;
  await issueEmailVerificationToken(user.id, user.email);
}

export async function requestPasswordReset(email: string) {
  const user = await userRepository.findByEmail(email);
  if (!user) return;

  const { raw, hash } = generateToken();
  await tokenRepository.replacePasswordResetToken({
    userId: user.id,
    tokenHash: hash,
    expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
  });
  await sendPasswordResetEmail(user.email, raw);
}

export async function resetPassword(token: string, newPassword: string) {
  const record = requireActiveResetToken(await tokenRepository.findPasswordResetToken(hashToken(token)));
  await tokenRepository.changePassword(record, await hashPassword(newPassword));
}

async function issueEmailVerificationToken(userId: string, email: string) {
  const { raw, hash } = generateToken();
  await tokenRepository.replaceEmailVerificationToken({
    userId,
    tokenHash: hash,
    expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
  });
  await sendVerificationEmail(email, raw);
}
