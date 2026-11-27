import type { NextFunction, Request, Response } from "express";
import { readAccessToken } from "../utils/jwt";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const payload = readAccessToken(req.cookies?.access_token as string | undefined);
  req.user = { id: payload.sub, role: payload.role, email: payload.email };
  next();
}
