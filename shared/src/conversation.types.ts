export interface PublicMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
}

export interface PublicConversation {
  id: string;
  offerId: string;
  offerTitle: string;
  breedingName: string;
  customerId: string;
  customerName: string;
  breederUserId: string;
  createdAt: string;
  lastMessage: PublicMessage | null;
}
