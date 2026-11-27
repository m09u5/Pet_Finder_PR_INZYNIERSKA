import type { NextFunction, Request, Response } from "express";
import { MAX_IMAGE_COUNT, MAX_IMAGE_SIZE_BYTES } from "@pet-finder/shared";
import multer, { MulterError } from "multer";
import { BadRequestError } from "../utils/AppError";

const parseImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: MAX_IMAGE_COUNT },
}).array("images", MAX_IMAGE_COUNT);

export function uploadImages(req: Request, res: Response, next: NextFunction) {
  parseImages(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }
    next(
      error instanceof MulterError
        ? error
        : new BadRequestError("Nie udało się odczytać przesłanych plików", "INVALID_UPLOAD"),
    );
  });
}
