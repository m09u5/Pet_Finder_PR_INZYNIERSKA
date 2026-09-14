import type { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { NotFoundError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { toPublicUser } from "../utils/publicUser";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getUserById(req.user!.id);
  if (!user) {
    throw new NotFoundError("Uzytkonik o podanym mailu nie istnieje");
  }
  res.json({ user: toPublicUser(user) });
});
