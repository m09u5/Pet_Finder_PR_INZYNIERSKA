import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { ForbiddenError, NotFoundError } from "../utils/AppError";

async function loadBreederProfile(userId: string) {
  return prisma.breederProfile.findUnique({ where: { userId } });
}

export async function attachBreederProfile(req: Request, _res: Response, next: NextFunction) {
  const profile = await loadBreederProfile(req.user!.id);
  if (!profile) {
    next(new NotFoundError("Nie znaleziono profilu hodowcy", "BREEDER_PROFILE_NOT_FOUND"));
    return;
  }
  req.breederProfile = profile;
  next();
}

export async function attachBreederProfileIfPresent(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role === "BREEDER") {
    req.breederProfile = (await loadBreederProfile(req.user.id)) ?? undefined;
  }
  next();
}

export async function requireVerifiedBreeder(req: Request, _res: Response, next: NextFunction) {
  const profile = await loadBreederProfile(req.user!.id);
  if (!profile) {
    next(new ForbiddenError("Brak profilu hodowcy", "NOT_BREEDER"));
    return;
  }
  if (profile.verificationStatus !== "VERIFIED") {
    next(new ForbiddenError("Hodowca nie jest zweryfikowany", "BREEDER_NOT_VERIFIED"));
    return;
  }
  req.breederProfile = profile;
  next();
}
