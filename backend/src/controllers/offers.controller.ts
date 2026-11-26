import type { Request, Response } from "express";
import type { AddAnimalInput, ListOffersQuery, UpdateAnimalInput } from "@pet-finder/shared";
import * as offerService from "../services/offer.service";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpStatus } from "../utils/httpStatus";
import { toPublicOffer } from "../utils/publicOffer";

export const listOffers = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ListOffersQuery;
  const result = await offerService.listPublicOffers(query);
  res.status(HttpStatus.OK).json({
    items: result.items.map((entry) => ({ ...toPublicOffer(entry.offer), distanceKm: entry.distanceKm })),
    total: result.total,
    page: result.page,
    limit: result.limit,
  });
});

export const getMyOffer = asyncHandler(async (req: Request, res: Response) => {
  const offer = await offerService.getMyOffer(req.breederProfile!.id);
  res.status(HttpStatus.OK).json({ offer: offer ? toPublicOffer(offer) : null });
});

export const getOffer = asyncHandler(async (req: Request, res: Response) => {
  const offer = await offerService.getOfferById(req.params.id);
  res.status(HttpStatus.OK).json({ offer: toPublicOffer(offer) });
});

export const addAnimal = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as AddAnimalInput;
  const offer = await offerService.addAnimal(req.breederProfile!.id, req.breederProfile!.breedingName, input);
  res.status(HttpStatus.CREATED).json({ offer: toPublicOffer(offer) });
});

export const updateAnimal = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateAnimalInput;
  const offer = await offerService.updateAnimal(req.params.id, req.params.animalId, req.breederProfile!.id, input);
  res.status(HttpStatus.OK).json({ offer: toPublicOffer(offer) });
});

export const deactivateOffer = asyncHandler(async (req: Request, res: Response) => {
  await offerService.deactivateOffer(req.params.id, req.breederProfile!.id);
  res.status(HttpStatus.NO_CONTENT).send();
});
