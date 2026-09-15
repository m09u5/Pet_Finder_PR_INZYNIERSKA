import { Router } from "express";
import { UserRole, addAnimalSchema, listOffersQuerySchema, updateAnimalSchema } from "@pet-finder/shared";
import * as imagesController from "../controllers/images.controller";
import * as offersController from "../controllers/offers.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { attachBreederProfile, requireVerifiedBreeder } from "../middleware/breederProfile";
import { uploadImages } from "../middleware/upload";
import { validateBody, validateQuery } from "../middleware/validate";

export const offersRouter = Router();

offersRouter.get("/", validateQuery(listOffersQuerySchema), offersController.listOffers);
offersRouter.get("/mine", authenticate, authorize(UserRole.BREEDER), attachBreederProfile, offersController.getMyOffer);
offersRouter.get("/:id", offersController.getOffer);

offersRouter.post(
  "/",
  authenticate,
  authorize(UserRole.BREEDER),
  requireVerifiedBreeder,
  validateBody(addAnimalSchema),
  offersController.addAnimal,
);

offersRouter.put(
  "/:id/animals/:animalId",
  authenticate,
  authorize(UserRole.BREEDER),
  requireVerifiedBreeder,
  validateBody(updateAnimalSchema),
  offersController.updateAnimal,
);

offersRouter.delete(
  "/:id",
  authenticate,
  authorize(UserRole.BREEDER),
  requireVerifiedBreeder,
  offersController.deactivateOffer,
);

offersRouter.post(
  "/:id/images",
  authenticate,
  authorize(UserRole.BREEDER),
  requireVerifiedBreeder,
  uploadImages,
  imagesController.uploadOfferImages,
);

offersRouter.post(
  "/:id/animals/:animalId/images",
  authenticate,
  authorize(UserRole.BREEDER),
  requireVerifiedBreeder,
  uploadImages,
  imagesController.uploadAnimalImages,
);
