import { createServer } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import WebSocket from "ws";
import { createApp } from "../src/app";
import { prisma } from "../src/config/prisma";
import { hashPassword } from "../src/utils/password";
import { signAccessToken } from "../src/utils/jwt";
import { setupChatWebSocket } from "../src/websocket/chat.ws";

const app = createApp();
const createdEmails: string[] = [];

function uniqueEmail(label: string) {
  const email = `test-conversations-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  createdEmails.push(email);
  return email;
}

async function loginAgent(email: string, password: string) {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send({ email, password });
  return agent;
}

async function createCustomer(label: string) {
  const email = uniqueEmail(label);
  const password = "correct-horse-battery-staple";
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      firstName: "Klient",
      lastName: label,
      role: "CUSTOMER",
      emailVerified: true,
    },
  });
  const agent = await loginAgent(email, password);
  return { email, password, user, agent };
}

async function createVerifiedBreederWithOffer(label: string) {
  const email = uniqueEmail(label);
  const password = "correct-horse-battery-staple";
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      firstName: "Hodowca",
      lastName: label,
      role: "BREEDER",
      emailVerified: true,
    },
  });
  const profile = await prisma.breederProfile.create({
    data: {
      userId: user.id,
      breedingName: `Hodowla ${label}`,
      verificationStatus: "VERIFIED",
      street: "ul. Testowa 1",
      city: "Warszawa",
      postalCode: "00-001",
    },
  });
  const agent = await loginAgent(email, password);
  const createResponse = await agent.post("/api/offers").send({
    animal: {
      name: "Luna",
      species: "cat",
      breed: "Ragdoll",
      sex: "FEMALE",
      birthDate: "2024-03-15",
      price: 3500,
    },
  });
  return { email, password, user, profile, agent, offer: createResponse.body.offer };
}

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { in: createdEmails } } });
  await prisma.$disconnect();
});

describe("POST /api/conversations", () => {
  it("returns 403 for a BREEDER trying to start a conversation", async () => {
    const breeder = await createVerifiedBreederWithOffer("self-start");
    const response = await breeder.agent.post("/api/conversations").send({ offerId: breeder.offer.id });
    expect(response.status).toBe(403);
  });

  it("creates a conversation for a customer and an offer", async () => {
    const breeder = await createVerifiedBreederWithOffer("create");
    const customer = await createCustomer("create");

    const response = await customer.agent.post("/api/conversations").send({ offerId: breeder.offer.id });

    expect(response.status).toBe(201);
    expect(response.body.conversation.offerId).toBe(breeder.offer.id);
    expect(response.body.conversation.breederUserId).toBe(breeder.user.id);
  });

  it("returns the same conversation when called twice for the same offer and customer", async () => {
    const breeder = await createVerifiedBreederWithOffer("idempotent");
    const customer = await createCustomer("idempotent");

    const first = await customer.agent.post("/api/conversations").send({ offerId: breeder.offer.id });
    const second = await customer.agent.post("/api/conversations").send({ offerId: breeder.offer.id });

    expect(second.body.conversation.id).toBe(first.body.conversation.id);
    const count = await prisma.conversation.count({ where: { id: first.body.conversation.id } });
    expect(count).toBe(1);
  });

  it("returns 404 for a non-existent offer", async () => {
    const customer = await createCustomer("missing-offer");
    const response = await customer.agent
      .post("/api/conversations")
      .send({ offerId: "00000000-0000-0000-0000-000000000000" });
    expect(response.status).toBe(404);
  });
});

describe("GET /api/conversations", () => {
  it("lists the same conversation for both the customer and the breeder", async () => {
    const breeder = await createVerifiedBreederWithOffer("list");
    const customer = await createCustomer("list");
    const created = await customer.agent.post("/api/conversations").send({ offerId: breeder.offer.id });

    const customerList = await customer.agent.get("/api/conversations");
    const breederList = await breeder.agent.get("/api/conversations");

    expect(customerList.body.conversations.map((c: { id: string }) => c.id)).toContain(created.body.conversation.id);
    expect(breederList.body.conversations.map((c: { id: string }) => c.id)).toContain(created.body.conversation.id);
  });
});

describe("POST /api/conversations/:id/messages and GET /:id/messages", () => {
  it("returns 403 for a user who isn't a participant", async () => {
    const breeder = await createVerifiedBreederWithOffer("intruder-target");
    const customer = await createCustomer("intruder-target");
    const created = await customer.agent.post("/api/conversations").send({ offerId: breeder.offer.id });

    const intruder = await createCustomer("intruder");
    const response = await intruder.agent
      .post(`/api/conversations/${created.body.conversation.id}/messages`)
      .send({ content: "hej" });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("NOT_PARTICIPANT");
  });

  it("persists a message sent by either participant and returns it in history", async () => {
    const breeder = await createVerifiedBreederWithOffer("history");
    const customer = await createCustomer("history");
    const created = await customer.agent.post("/api/conversations").send({ offerId: breeder.offer.id });
    const conversationId = created.body.conversation.id;

    await customer.agent.post(`/api/conversations/${conversationId}/messages`).send({ content: "Cześć, jest dostępna?" });
    await breeder.agent.post(`/api/conversations/${conversationId}/messages`).send({ content: "Tak, zapraszam!" });

    const history = await customer.agent.get(`/api/conversations/${conversationId}/messages`);
    expect(history.status).toBe(200);
    expect(history.body.messages).toHaveLength(2);
    expect(history.body.messages[0].content).toBe("Cześć, jest dostępna?");
    expect(history.body.messages[1].content).toBe("Tak, zapraszam!");
  });

  it("marks the other participant's messages as read when the recipient fetches history", async () => {
    const breeder = await createVerifiedBreederWithOffer("read-receipt");
    const customer = await createCustomer("read-receipt");
    const created = await customer.agent.post("/api/conversations").send({ offerId: breeder.offer.id });
    const conversationId = created.body.conversation.id;

    await customer.agent.post(`/api/conversations/${conversationId}/messages`).send({ content: "hej" });
    await breeder.agent.get(`/api/conversations/${conversationId}/messages`);

    const message = await prisma.message.findFirst({ where: { conversationId } });
    expect(message?.readAt).not.toBeNull();
  });
});

describe("WebSocket live delivery", () => {
  let server: ReturnType<typeof createServer>;
  let baseWsUrl: string;

  beforeAll(async () => {
    server = createServer(app);
    setupChatWebSocket(server);
    await new Promise<void>((resolve) => {
      server.listen(0, () => resolve());
    });
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;
    baseWsUrl = `ws://127.0.0.1:${port}/ws/chat`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it("pushes a REST-sent message to the other participant's open socket in real time", async () => {
    const breeder = await createVerifiedBreederWithOffer("ws-push");
    const customer = await createCustomer("ws-push");
    const created = await customer.agent.post("/api/conversations").send({ offerId: breeder.offer.id });
    const conversationId = created.body.conversation.id;

    const breederToken = signAccessToken({ sub: breeder.user.id, role: "BREEDER", email: breeder.email });
    const socket = new WebSocket(baseWsUrl, { headers: { Cookie: `access_token=${breederToken}` } });

    await new Promise<void>((resolve, reject) => {
      socket.once("open", () => resolve());
      socket.once("error", reject);
    });

    const messagePromise = new Promise<{ type: string; message: { content: string; conversationId: string } }>(
      (resolve) => {
        socket.once("message", (data) => resolve(JSON.parse(data.toString())));
      },
    );

    await customer.agent.post(`/api/conversations/${conversationId}/messages`).send({ content: "Na żywo!" });

    const received = await messagePromise;
    expect(received.type).toBe("message");
    expect(received.message.conversationId).toBe(conversationId);
    expect(received.message.content).toBe("Na żywo!");

    socket.close();
  });

  it("rejects a connection without a valid access token", async () => {
    const socket = new WebSocket(baseWsUrl);
    const closeCode = await new Promise<number>((resolve) => {
      socket.once("close", (code) => resolve(code));
    });
    expect(closeCode).toBe(4001);
  });
});
