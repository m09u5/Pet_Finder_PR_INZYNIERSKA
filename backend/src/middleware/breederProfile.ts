import type { NextFunction, Request, Response } from "express";
import { breederRepository } from "../config/repositories";
import { asyncHandler } from "../utils/asyncHandler";
import { requireVerifiedProfile } from "../utils/validators/breeder.validators";
import { requireFound } from "../utils/validators/found.validators";

export const attachBreederProfile = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  req.breederProfile = requireFound(
    await breederRepository.findByUserId(req.user!.id),
    "Nie znaleziono profilu hodowcy",
    "BREEDER_PROFILE_NOT_FOUND",
  );
  next();
});

export const attachBreederProfileIfPresent = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role === "BREEDER") {
    req.breederProfile = (await breederRepository.findByUserId(req.user.id)) ?? undefined;
  }
  next();
});

export const requireVerifiedBreeder = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  req.breederProfile = requireVerifiedProfile(await breederRepository.findByUserId(req.user!.id));
  next();
});
