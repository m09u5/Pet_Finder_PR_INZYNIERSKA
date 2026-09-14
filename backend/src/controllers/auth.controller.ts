import type { Request, Response } from "express";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResendVerificationInput,
  ResetPasswordInput,
  VerifyEmailQuery,
} from "@pet-finder/shared";
import * as authService from "../services/auth.service";
import { UnauthorizedError } from "../utils/AppError";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import { asyncHandler } from "../utils/asyncHandler";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { toPublicUser } from "../utils/publicUser";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as RegisterInput;
  const user = await authService.registerUser(input);
  res.status(201).json({
    message: "Konto zostalo utworzone prosze o potwierdzenie maila",
    user: toPublicUser(user),
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;
  const user = await authService.loginUser(email, password);

  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id });
  setAuthCookies(res, { accessToken, refreshToken });

  res.json({ user: toPublicUser(user) });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookies(res);
  res.status(204).send();
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token as string | undefined;
  if (!token) {
    throw new UnauthorizedError("Brak sesji do odświeżenia", "NOT_AUTHENTICATED");
  }

  let userId: string;
  try {
    userId = verifyRefreshToken(token).sub;
  } catch {
    throw new UnauthorizedError("Sesja wygasła, prosze zalogowac się ponownie", "INVALID_TOKEN");
  }

  const user = await authService.getUserById(userId);
  if (!user) {
    throw new UnauthorizedError("podany użytkownik nie istnieje", "NOT_AUTHENTICATED");
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id });
  setAuthCookies(res, { accessToken, refreshToken });

  res.json({ user: toPublicUser(user) });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.query as unknown as VerifyEmailQuery;
  await authService.verifyEmail(token);
  res.json({ message: "Adres e-mail został potwierdzony." });
});

export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as ResendVerificationInput;
  await authService.resendVerificationEmail(email);
  res.json({ message: "jeśli konto istnieje i nie zostało jeszcze zweryfikowane, wyslany zostanie nowy link" });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as ForgotPasswordInput;
  await authService.requestPasswordReset(email);
  res.json({ message: "jezeli konto na podany email istnieje wyslemy link do resetu" });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body as ResetPasswordInput;
  await authService.resetPassword(token, newPassword);
  res.json({ message: "pomyslnie zmieniono haslo, zaloguj sie" });
});
