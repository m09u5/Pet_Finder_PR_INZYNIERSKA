import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailQuerySchema,
} from "@pet-finder/shared";
import * as authController from "../controllers/auth.controller";
import { validateBody, validateQuery } from "../middleware/validate";

export const authRouter = Router();


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post("/register", authLimiter, validateBody(registerSchema), authController.register);
authRouter.post("/login", authLimiter, validateBody(loginSchema), authController.login);
authRouter.post("/logout", authController.logout);
authRouter.post("/refresh", authController.refresh);
authRouter.get("/verify-email", validateQuery(verifyEmailQuerySchema), authController.verifyEmail);
authRouter.post(
  "/resend-verification",
  authLimiter,
  validateBody(resendVerificationSchema),
  authController.resendVerification,
);
authRouter.post("/forgot-password", authLimiter, validateBody(forgotPasswordSchema), authController.forgotPassword);
authRouter.post("/reset-password", authLimiter, validateBody(resetPasswordSchema), authController.resetPassword);
