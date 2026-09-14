import { Router } from "express";
import { UserRole } from "@pet-finder/shared";
import * as imagesController from "../controllers/images.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { attachBreederProfile } from "../middleware/breederProfile";

export const imagesRouter = Router();

imagesRouter.delete(
  "/:id",
  authenticate,
  authorize(UserRole.BREEDER),
  attachBreederProfile,
  imagesController.deleteImage,
);
