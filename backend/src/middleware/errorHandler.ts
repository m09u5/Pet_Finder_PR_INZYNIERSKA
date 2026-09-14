import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: err.flatten().fieldErrors,
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
  }

  console.error(`[unhandled error] ${req.method} ${req.path}:`, err);

  return res.status(500).json({
    error: {
      message: env.NODE_ENV === "production" ? "Internal server error" : (err as Error).message,
      code: "INTERNAL_ERROR",
    },
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: { message: `Route ${req.method} ${req.path} not found`, code: "ROUTE_NOT_FOUND" } });
}
