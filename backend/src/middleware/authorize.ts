import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@pet-finder/shared";
import { ForbiddenError } from "../utils/AppError";


export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new ForbiddenError("Brak wymaganych uprawnień", "INSUFFICIENT_ROLE"));
      return;
    }
    next();
  };
}
