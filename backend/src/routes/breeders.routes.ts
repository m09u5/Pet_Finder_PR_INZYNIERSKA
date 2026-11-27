import { Router } from "express";
import { UserRole, updateBreederProfileSchema } from "@pet-finder/shared";
import * as breedersController from "../controllers/breeders.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { attachBreederProfile } from "../middleware/breederProfile";
import { uploadLogo } from "../middleware/upload";
import { validateBody } from "../middleware/validate";

export const breedersRouter = Router();

breedersRouter.get(
  "/me",
  authenticate,
  authorize(UserRole.BREEDER),
  attachBreederProfile,
  breedersController.getMyBreederProfile,
);

breedersRouter.patch(
  "/me",
  authenticate,
  authorize(UserRole.BREEDER),
  attachBreederProfile,
  validateBody(updateBreederProfileSchema),
  breedersController.updateMyBreederProfile,
);

breedersRouter.post(
  "/me/logo",
  authenticate,
  authorize(UserRole.BREEDER),
  attachBreederProfile,
  uploadLogo,
  breedersController.uploadMyLogo,
);

breedersRouter.delete(
  "/me/logo",
  authenticate,
  authorize(UserRole.BREEDER),
  attachBreederProfile,
  breedersController.deleteMyLogo,
);
