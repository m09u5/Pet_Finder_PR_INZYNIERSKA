import type { Request, Response } from "express";
import type { CreateConversationInput, ListMessagesQuery, SendMessageInput } from "@pet-finder/shared";
import * as conversationService from "../services/conversation.service";
import { asyncHandler } from "../utils/asyncHandler";
import { toPublicConversation } from "../utils/publicConversation";
import { toPublicMessage } from "../utils/publicMessage";

export const startConversation = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateConversationInput;
  const conversation = await conversationService.startConversation(req.user!.id, input);
  res.status(201).json({ conversation: toPublicConversation(conversation) });
});

export const listMyConversations = asyncHandler(async (req: Request, res: Response) => {
  const conversations = await conversationService.listMyConversations(req.user!.id, req.user!.role);
  res.json({ conversations: conversations.map(toPublicConversation) });
});

export const listMessages = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ListMessagesQuery;
  const result = await conversationService.listMessages(req.params.id, req.user!.id, query);
  res.json({
    messages: result.items.map(toPublicMessage),
    total: result.total,
    page: result.page,
    limit: result.limit,
    conversation: toPublicConversation(result.conversation),
  });
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as SendMessageInput;
  const message = await conversationService.sendMessage(req.params.id, req.user!.id, input);
  res.status(201).json({ message: toPublicMessage(message) });
});
