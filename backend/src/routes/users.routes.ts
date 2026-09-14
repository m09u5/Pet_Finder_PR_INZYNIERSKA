import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import * as usersController from "../controllers/users.controller";

export const usersRouter = Router();

usersRouter.get("/me", authenticate, usersController.getMe);
