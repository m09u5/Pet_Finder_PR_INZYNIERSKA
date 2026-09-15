import path from "node:path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { adminRouter } from "./routes/admin.routes";
import { authRouter } from "./routes/auth.routes";
import { breedersRouter } from "./routes/breeders.routes";
import { conversationsRouter } from "./routes/conversations.routes";
import { healthRouter } from "./routes/health.routes";
import { imagesRouter } from "./routes/images.routes";
import { offersRouter } from "./routes/offers.routes";
import { reservationsRouter } from "./routes/reservations.routes";
import { usersRouter } from "./routes/users.routes";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/breeders", breedersRouter);
  app.use("/api/offers", offersRouter);
  app.use("/api/images", imagesRouter);
  app.use("/api/reservations", reservationsRouter);
  app.use("/api/conversations", conversationsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
