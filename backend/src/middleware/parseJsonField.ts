import type { NextFunction, Request, Response } from "express";
import { parseJson } from "../utils/parseJson";

export function parseJsonField(field: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const value: unknown = req.body?.[field];
    if (typeof value === "string") {
      req.body[field] = parseJson(value);
    }
    next();
  };
}
