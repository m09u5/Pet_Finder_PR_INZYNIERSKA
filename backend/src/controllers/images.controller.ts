import type { Request, Response } from "express";
import * as imageService from "../services/image.service";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpStatus } from "../utils/httpStatus";
import { toPublicImage } from "../utils/publicImage";
import { getUploadedFiles } from "../utils/uploadedFiles";

export const uploadOfferImages = asyncHandler(async (req: Request, res: Response) => {
  const images = await imageService.addOfferImages(req.params.id, req.breederProfile!.id, getUploadedFiles(req));
  res.status(HttpStatus.CREATED).json({ images: images.map(toPublicImage) });
});

export const uploadAnimalImages = asyncHandler(async (req: Request, res: Response) => {
  const images = await imageService.addAnimalImages(
    req.params.id,
    req.params.animalId,
    req.breederProfile!.id,
    getUploadedFiles(req),
  );
  res.status(HttpStatus.CREATED).json({ images: images.map(toPublicImage) });
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  await imageService.deleteOwnedImage(req.params.id, req.breederProfile!.id);
  res.status(HttpStatus.NO_CONTENT).send();
});
