import { Router } from "express";
import { healthRepository } from "../config/repositories";
import { asyncHandler } from "../utils/asyncHandler";

export const healthRouter = Router();

healthRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    await healthRepository.ping();
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  }),
);
