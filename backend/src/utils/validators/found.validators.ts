import { NotFoundError } from "../AppError";

export function requireFound<T>(value: T | null | undefined, message: string, code?: string): T {
  if (value === null || value === undefined) {
    throw new NotFoundError(message, code);
  }
  return value;
}
