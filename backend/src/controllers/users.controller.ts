import type { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpStatus } from "../utils/httpStatus";
import { toPublicUser } from "../utils/publicUser";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getUserById(req.user!.id);
  res.status(HttpStatus.OK).json({ user: toPublicUser(user) });
});
