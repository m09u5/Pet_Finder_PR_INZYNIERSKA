import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/config/prisma";
import { hashPassword } from "../src/utils/password";

const app = createApp();
const createdEmails: string[] = [];

function uniqueEmail(label: string) {
  const email = `test-admin-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  createdEmails.push(email);
  return email;
}

async function loginAgent(email: string, password: string) {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send({ email, password });
  return agent;
}

let adminEmail: string;
let customerEmail: string;
const adminPassword = "correct-horse-battery-staple";
const customerPassword = "correct-horse-battery-staple";

beforeAll(async () => {
  adminEmail = uniqueEmail("admin");
  await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      firstName: "Ala",
      lastName: "Admin",
      role: "ADMIN",
      emailVerified: true,
    },
  });

  customerEmail = uniqueEmail("customer");
  await prisma.user.create({
    data: {
      email: customerEmail,
      passwordHash: await hashPassword(customerPassword),
      firstName: "Jan",
      lastName: "Klient",
      role: "CUSTOMER",
      emailVerified: true,
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { in: createdEmails } } });
  await prisma.$disconnect();
});

describe("GET /api/admin/breeders", () => {
  it("returns 401 without a session", async () => {
    const response = await request(app).get("/api/admin/breeders");
    expect(response.status).toBe(401);
  });

  it("returns 403 for a CUSTOMER", async () => {
    const agent = await loginAgent(customerEmail, customerPassword);
    const response = await agent.get("/api/admin/breeders");
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("INSUFFICIENT_ROLE");
  });

  it("lists a newly registered breeder with PENDING status and owner details", async () => {
    const breederEmail = uniqueEmail("breeder");
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        role: "BREEDER",
        email: breederEmail,
        password: "correct-horse-battery-staple",
        firstName: "Anna",
        lastName: "Hodowca",
        breederProfile: {
          breedingName: "Hodowla Testowa",
          latitude: 52.2297,
          longitude: 21.0122,
        },
      });

    const agent = await loginAgent(adminEmail, adminPassword);
    const response = await agent.get("/api/admin/breeders?status=PENDING");

    expect(response.status).toBe(200);
    const found = response.body.items.find((item: { owner: { id: string } }) => item.owner.id === registerResponse.body.user.id);
    expect(found).toBeDefined();
    expect(found.verificationStatus).toBe("PENDING");
    expect(found.owner.email).toBe(breederEmail);
  });
});

describe("PATCH /api/admin/breeders/:id/verification", () => {
  it("returns 403 for a CUSTOMER", async () => {
    const agent = await loginAgent(customerEmail, customerPassword);
    const response = await agent.patch("/api/admin/breeders/00000000-0000-0000-0000-000000000000/verification").send({
      status: "VERIFIED",
    });
    expect(response.status).toBe(403);
  });

  it("returns 400 for an invalid status value", async () => {
    const agent = await loginAgent(adminEmail, adminPassword);
    const response = await agent.patch("/api/admin/breeders/00000000-0000-0000-0000-000000000000/verification").send({
      status: "PENDING",
    });
    expect(response.status).toBe(400);
  });

  it("returns 404 for a non-existent breeder profile", async () => {
    const agent = await loginAgent(adminEmail, adminPassword);
    const response = await agent.patch("/api/admin/breeders/00000000-0000-0000-0000-000000000000/verification").send({
      status: "VERIFIED",
    });
    expect(response.status).toBe(404);
  });

  it("lets an ADMIN verify a breeder", async () => {
    const breederEmail = uniqueEmail("breeder-to-verify");
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        role: "BREEDER",
        email: breederEmail,
        password: "correct-horse-battery-staple",
        firstName: "Piotr",
        lastName: "Hodowca",
        breederProfile: {
          breedingName: "Hodowla Do Weryfikacji",
          latitude: 50.0647,
          longitude: 19.945,
        },
      });

    const breederProfile = await prisma.breederProfile.findUnique({
      where: { userId: registerResponse.body.user.id },
    });

    const agent = await loginAgent(adminEmail, adminPassword);
    const response = await agent.patch(`/api/admin/breeders/${breederProfile!.id}/verification`).send({
      status: "VERIFIED",
    });

    expect(response.status).toBe(200);
    expect(response.body.breeder.verificationStatus).toBe("VERIFIED");

    const updated = await prisma.breederProfile.findUnique({ where: { id: breederProfile!.id } });
    expect(updated?.verificationStatus).toBe("VERIFIED");
  });
});
