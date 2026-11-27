import { MAX_IMAGE_COUNT, MAX_IMAGE_SIZE_BYTES } from "@pet-finder/shared";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import multer, { MulterError } from "multer";
import { BadRequestError } from "../utils/AppError";

function uploadFiles(field: string, maxCount: number) {
  const parse: RequestHandler = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: maxCount },
  }).array(field, maxCount);

  return (req: Request, res: Response, next: NextFunction) => {
    parse(req, res, (error: unknown) => {
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
  };
}

export const uploadImages = uploadFiles("images", MAX_IMAGE_COUNT);
export const uploadLogo = uploadFiles("logo", 1);
