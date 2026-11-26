import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env";
import { NotFoundError } from "../utils/AppError";
import { HttpStatus } from "../utils/httpStatus";
import { toAppError } from "../utils/toAppError";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ZodError) {
    res.status(HttpStatus.BAD_REQUEST).json({
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  const appError = toAppError(err);
  if (appError) {
    res.status(appError.statusCode).json({ error: { message: appError.message, code: appError.code } });
    return;
  }

  console.error(`[unhandled error] ${req.method} ${req.path}:`, err);

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    error: {
      message: env.NODE_ENV === "production" ? "Internal server error" : (err as Error).message,
      code: "INTERNAL_ERROR",
    },
  });
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new NotFoundError(`Route ${req.method} ${req.path} not found`, "ROUTE_NOT_FOUND"));
}
