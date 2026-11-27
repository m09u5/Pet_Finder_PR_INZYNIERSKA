import { MAX_IMAGE_COUNT, MAX_IMAGE_SIZE_MB } from "@pet-finder/shared";
import { Prisma } from "@prisma/client";
import { MulterError } from "multer";
import { AppError, BadRequestError, ConflictError, NotFoundError, PayloadTooLargeError } from "./AppError";

interface BodyParserError extends Error {
  type: string;
  status: number;
}

function isBodyParserError(error: unknown): error is BodyParserError {
  return error instanceof Error && "type" in error && "status" in error;
}

function fromBodyParserError(error: BodyParserError) {
  if (error.type === "entity.parse.failed") {
    return new BadRequestError("Nieprawidłowy format JSON", "INVALID_JSON");
  }
  if (error.type === "entity.too.large") {
    return new PayloadTooLargeError("Żądanie jest zbyt duże", "PAYLOAD_TOO_LARGE");
  }
  return new AppError(error.status, "Nieprawidłowe żądanie", "INVALID_REQUEST");
}

function fromMulterError(error: MulterError) {
  if (error.code === "LIMIT_FILE_SIZE") {
    return new PayloadTooLargeError(`Plik jest zbyt duży (maksymalnie ${MAX_IMAGE_SIZE_MB} MB)`, "FILE_TOO_LARGE");
  }
  return new BadRequestError(
    `Nieprawidłowe przesyłanie plików (złe pole lub więcej niż ${MAX_IMAGE_COUNT} zdjęć)`,
    "INVALID_UPLOAD",
  );
}

function fromPrismaError(error: Prisma.PrismaClientKnownRequestError) {
  switch (error.code) {
    case "P2002":
      return new ConflictError("Taki zasób już istnieje", "ALREADY_EXISTS");
    case "P2003":
      return new ConflictError("Operacja narusza powiązania między danymi", "RELATION_CONFLICT");
    case "P2025":
      return new NotFoundError("Zasób nie istnieje", "NOT_FOUND");
    default:
      return null;
  }
}

export function toAppError(error: unknown): AppError | null {
  if (error instanceof AppError) return error;
  if (error instanceof MulterError) return fromMulterError(error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) return fromPrismaError(error);
  if (isBodyParserError(error)) return fromBodyParserError(error);
  return null;
}
