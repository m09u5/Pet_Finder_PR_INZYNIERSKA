import { BadRequestError } from "./AppError";

export function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    throw new BadRequestError("Nieprawidłowy format JSON", "INVALID_JSON");
  }
}
