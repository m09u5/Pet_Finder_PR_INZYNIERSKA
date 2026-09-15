import { Router } from "express";
import { UserRole, createReservationSchema } from "@pet-finder/shared";
import * as reservationsController from "../controllers/reservations.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { attachBreederProfile, attachBreederProfileIfPresent } from "../middleware/breederProfile";
import { validateBody } from "../middleware/validate";

export const reservationsRouter = Router();

reservationsRouter.post(
  "/",
  authenticate,
  authorize(UserRole.CUSTOMER),
  validateBody(createReservationSchema),
  reservationsController.createReservation,
);

reservationsRouter.get("/mine", authenticate, authorize(UserRole.CUSTOMER), reservationsController.listMyReservations);

reservationsRouter.get(
  "/incoming",
  authenticate,
  authorize(UserRole.BREEDER),
  attachBreederProfile,
  reservationsController.listIncomingReservations,
);

reservationsRouter.patch(
  "/:id/confirm",
  authenticate,
  authorize(UserRole.BREEDER),
  attachBreederProfile,
  reservationsController.confirmReservation,
);

reservationsRouter.patch(
  "/:id/cancel",
  authenticate,
  attachBreederProfileIfPresent,
  reservationsController.cancelReservation,
);
