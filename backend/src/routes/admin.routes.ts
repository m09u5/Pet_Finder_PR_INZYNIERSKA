import { Router } from "express";
import { UserRole, listBreedersQuerySchema, updateVerificationStatusSchema } from "@pet-finder/shared";
import * as adminController from "../controllers/admin.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validateBody, validateQuery } from "../middleware/validate";

export const adminRouter = Router();

adminRouter.use(authenticate, authorize(UserRole.ADMIN));

adminRouter.get("/breeders", validateQuery(listBreedersQuerySchema), adminController.listBreeders);
adminRouter.patch(
  "/breeders/:id/verification",
  validateBody(updateVerificationStatusSchema),
  adminController.updateBreederVerification,
);
