import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.access_token as string | undefined;

  if (!token) {
    next(new UnauthorizedError("zaloguj sie", "NOT_AUTHENTICATED"));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    next(new UnauthorizedError("sesja wygasla zaloguj sie ponownie", "INVALID_TOKEN"));
  }
}
