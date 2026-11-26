import jwt, { type SignOptions } from "jsonwebtoken";
import type { UserRole } from "@pet-finder/shared";
import { env } from "../config/env";
import { UnauthorizedError } from "./AppError";

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
  email: string;
}

export interface RefreshTokenPayload {
  sub: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

export function readAccessToken(token: string | undefined): AccessTokenPayload {
  if (!token) {
    throw new UnauthorizedError("zaloguj sie", "NOT_AUTHENTICATED");
  }
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  } catch {
    throw new UnauthorizedError("sesja wygasla zaloguj sie ponownie", "INVALID_TOKEN");
  }
}

export function readRefreshToken(token: string | undefined): RefreshTokenPayload {
  if (!token) {
    throw new UnauthorizedError("Brak sesji do odświeżenia", "NOT_AUTHENTICATED");
  }
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch {
    throw new UnauthorizedError("Sesja wygasła, prosze zalogowac się ponownie", "INVALID_TOKEN");
  }
}
