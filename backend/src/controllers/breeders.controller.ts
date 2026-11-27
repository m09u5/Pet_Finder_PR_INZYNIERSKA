import type { Request, Response } from "express";
import type { UpdateBreederProfileInput } from "@pet-finder/shared";
import * as breederService from "../services/breeder.service";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpStatus } from "../utils/httpStatus";
import { toPublicBreederProfile } from "../utils/publicBreederProfile";

export const getMyBreederProfile = asyncHandler(async (req: Request, res: Response) => {
  res.status(HttpStatus.OK).json({ breeder: toPublicBreederProfile(req.breederProfile!) });
});

export const updateMyBreederProfile = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateBreederProfileInput;
  const breeder = await breederService.updateBreederProfile(req.breederProfile!.id, input);
  res.status(HttpStatus.OK).json({ breeder: toPublicBreederProfile(breeder) });
});
