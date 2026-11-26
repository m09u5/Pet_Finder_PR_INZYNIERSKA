import type { Request, Response } from "express";
import type { CreateConversationInput, ListMessagesQuery, SendMessageInput } from "@pet-finder/shared";
import * as conversationService from "../services/conversation.service";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpStatus } from "../utils/httpStatus";
import { toPublicConversation } from "../utils/publicConversation";
import { toPublicMessage } from "../utils/publicMessage";

export const startConversation = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateConversationInput;
  const { conversation, created } = await conversationService.startConversation(req.user!.id, input);
  res
    .status(created ? HttpStatus.CREATED : HttpStatus.OK)
    .json({ conversation: toPublicConversation(conversation) });
});

export const listMyConversations = asyncHandler(async (req: Request, res: Response) => {
  const conversations = await conversationService.listMyConversations(req.user!.id, req.user!.role);
  res.status(HttpStatus.OK).json({ conversations: conversations.map(toPublicConversation) });
});

export const listMessages = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ListMessagesQuery;
  const result = await conversationService.listMessages(req.params.id, req.user!.id, query);
  res.status(HttpStatus.OK).json({
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
  res.status(HttpStatus.CREATED).json({ message: toPublicMessage(message) });
});
