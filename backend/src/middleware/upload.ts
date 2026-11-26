import type { NextFunction, Request, Response } from "express";
import multer, { MulterError } from "multer";
import { MAX_FILE_SIZE_BYTES, MAX_FILES } from "../config/upload";
import { BadRequestError } from "../utils/AppError";

const parseImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: MAX_FILES },
}).array("images", MAX_FILES);

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
