import type { Request, Response } from "express";
import type { BreederProfile } from "@prisma/client";
import type { UpdateBreederProfileInput } from "@pet-finder/shared";
import { breederRepository } from "../repositories/breeder.repository";
import { asyncHandler } from "../utils/asyncHandler";

function toPublicBreederProfile(profile: BreederProfile) {
  return {
    id: profile.id,
    userId: profile.userId,
    breedingName: profile.breedingName,
    description: profile.description,
    verificationStatus: profile.verificationStatus,
    street: profile.street,
    city: profile.city,
    postalCode: profile.postalCode,
    latitude: profile.latitude,
    longitude: profile.longitude,
    createdAt: profile.createdAt.toISOString(),
  };
}

export const getMyBreederProfile = asyncHandler(async (req: Request, res: Response) => {
  res.json({ breeder: toPublicBreederProfile(req.breederProfile!) });
});

export const updateMyBreederProfile = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateBreederProfileInput;
  const updated = await breederRepository.updateProfile(req.breederProfile!.id, input);
  res.json({ breeder: toPublicBreederProfile(updated) });
});
