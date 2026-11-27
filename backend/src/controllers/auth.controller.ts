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
import { asyncHandler } from "../utils/asyncHandler";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import { HttpStatus } from "../utils/httpStatus";
import { toPublicUser } from "../utils/publicUser";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as RegisterInput;
  const user = await authService.registerUser(input);
  res.status(HttpStatus.CREATED).json({
    message: "Konto zostalo utworzone prosze o potwierdzenie maila",
    user: toPublicUser(user),
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;
  const { user, tokens } = await authService.loginUser(email, password);
  setAuthCookies(res, tokens);
  res.status(HttpStatus.OK).json({ user: toPublicUser(user) });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookies(res);
  res.status(HttpStatus.NO_CONTENT).send();
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await authService.refreshSession(req.cookies?.refresh_token as string | undefined);
  setAuthCookies(res, tokens);
  res.status(HttpStatus.OK).json({ user: toPublicUser(user) });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.query as unknown as VerifyEmailQuery;
  await authService.verifyEmail(token);
  res.status(HttpStatus.OK).json({ message: "Adres e-mail został potwierdzony." });
});

export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as ResendVerificationInput;
  await authService.resendVerificationEmail(email);
  res.status(HttpStatus.OK).json({
    message: "jeśli konto istnieje i nie zostało jeszcze zweryfikowane, wyslany zostanie nowy link",
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as ForgotPasswordInput;
  await authService.requestPasswordReset(email);
  res.status(HttpStatus.OK).json({ message: "jezeli konto na podany email istnieje wyslemy link do resetu" });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body as ResetPasswordInput;
  await authService.resetPassword(token, newPassword);
  res.status(HttpStatus.OK).json({ message: "pomyslnie zmieniono haslo, zaloguj sie" });
});
