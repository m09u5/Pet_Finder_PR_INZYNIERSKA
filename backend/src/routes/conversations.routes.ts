import { Router } from "express";
import { UserRole, createConversationSchema, listMessagesQuerySchema, sendMessageSchema } from "@pet-finder/shared";
import * as conversationsController from "../controllers/conversations.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validateBody, validateQuery } from "../middleware/validate";

export const conversationsRouter = Router();

conversationsRouter.post(
  "/",
  authenticate,
  authorize(UserRole.CUSTOMER),
  validateBody(createConversationSchema),
  conversationsController.startConversation,
);

conversationsRouter.get(
  "/",
  authenticate,
  authorize(UserRole.CUSTOMER, UserRole.BREEDER),
  conversationsController.listMyConversations,
);

conversationsRouter.get(
  "/:id/messages",
  authenticate,
  authorize(UserRole.CUSTOMER, UserRole.BREEDER),
  validateQuery(listMessagesQuerySchema),
  conversationsController.listMessages,
);

conversationsRouter.post(
  "/:id/messages",
  authenticate,
  authorize(UserRole.CUSTOMER, UserRole.BREEDER),
  validateBody(sendMessageSchema),
  conversationsController.sendMessage,
);
