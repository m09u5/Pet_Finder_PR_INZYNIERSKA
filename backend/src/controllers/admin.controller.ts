import type { Request, Response } from "express";
import type { ListBreedersQuery, UpdateVerificationStatusInput } from "@pet-finder/shared";
import * as breederService from "../services/breeder.service";
import { asyncHandler } from "../utils/asyncHandler";
import { toPublicBreederProfile } from "../utils/publicBreederProfile";

export const listBreeders = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ListBreedersQuery;
  const result = await breederService.listBreedersForAdmin(query);

  res.json({
    items: result.items.map(toPublicBreederProfile),
    total: result.total,
    page: result.page,
    limit: result.limit,
  });
});

export const updateBreederVerification = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateVerificationStatusInput;
  const breeder = await breederService.setBreederVerificationStatus(req.params.id, input);
  res.json({ breeder: toPublicBreederProfile(breeder) });
});
