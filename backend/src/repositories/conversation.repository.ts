import { prisma } from "../config/prisma";

const conversationInclude = {
  offer: { select: { id: true, title: true, breeder: { select: { breedingName: true } } } },
  customer: { select: { id: true, firstName: true, lastName: true } },
  messages: { orderBy: { createdAt: "desc" as const }, take: 1 },
} as const;

export const conversationRepository = {
  findByOfferAndCustomer(offerId: string, customerId: string) {
    return prisma.conversation.findUnique({
      where: { offerId_customerId: { offerId, customerId } },
      include: conversationInclude,
    });
  },
  create(offerId: string, customerId: string, breederId: string) {
    return prisma.conversation.create({
      data: { offerId, customerId, breederId },
      include: conversationInclude,
    });
  },
  findById(id: string) {
    return prisma.conversation.findUnique({ where: { id }, include: conversationInclude });
  },
  listForCustomer(customerId: string) {
    return prisma.conversation.findMany({
      where: { customerId },
      include: conversationInclude,
      orderBy: { createdAt: "desc" },
    });
  },
  listForBreeder(breederUserId: string) {
    return prisma.conversation.findMany({
      where: { breederId: breederUserId },
      include: conversationInclude,
      orderBy: { createdAt: "desc" },
    });
  },
  listMessages(conversationId: string, params: { skip: number; take: number }) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      skip: params.skip,
      take: params.take,
    });
  },
  countMessages(conversationId: string) {
    return prisma.message.count({ where: { conversationId } });
  },
  createMessage(conversationId: string, senderId: string, content: string) {
    return prisma.message.create({ data: { conversationId, senderId, content } });
  },
  markMessagesRead(conversationId: string, readerId: string) {
    return prisma.message.updateMany({
      where: { conversationId, senderId: { not: readerId }, readAt: null },
      data: { readAt: new Date() },
    });
  },
};
