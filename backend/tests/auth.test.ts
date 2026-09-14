import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/config/prisma";

const app = createApp();
const createdEmails: string[] = [];

function uniqueEmail(label: string) {
  const email = `test-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  createdEmails.push(email);
  return email;
}

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { in: createdEmails } } });
  await prisma.$disconnect();
});

describe("POST /api/auth/register", () => {
  it("creates a CUSTOMER account with emailVerified=false and never returns the password hash", async () => {
    const email = uniqueEmail("customer");

    const response = await request(app).post("/api/auth/register").send({
      role: "CUSTOMER",
      email,
      password: "correct-horse-battery-staple",
      firstName: "Jan",
      lastName: "Kowalski",
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe(email);
    expect(response.body.user.emailVerified).toBe(false);
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  it("rejects a duplicate email with 409", async () => {
    const email = uniqueEmail("duplicate");
    const payload = {
      role: "CUSTOMER",
      email,
      password: "correct-horse-battery-staple",
      firstName: "Jan",
      lastName: "Kowalski",
    };

    await request(app).post("/api/auth/register").send(payload);
    const response = await request(app).post("/api/auth/register").send(payload);

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("EMAIL_TAKEN");
  });

  it("rejects a password shorter than 8 characters with 400", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        role: "CUSTOMER",
        email: uniqueEmail("weak-pw"),
        password: "short",
        firstName: "Jan",
        lastName: "Kowalski",
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("registering as BREEDER creates a BreederProfile with PENDING verification status", async () => {
    const email = uniqueEmail("breeder");

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        role: "BREEDER",
        email,
        password: "correct-horse-battery-staple",
        firstName: "Anna",
        lastName: "Hodowca",
        breederProfile: {
          breedingName: "Hodowla Golden Dreams",
          latitude: 52.2297,
          longitude: 21.0122,
        },
      });

    expect(response.status).toBe(201);

    const profile = await prisma.breederProfile.findUnique({ where: { userId: response.body.user.id } });
    expect(profile?.verificationStatus).toBe("PENDING");
    expect(profile?.breedingName).toBe("Hodowla Golden Dreams");
  });
});

describe("POST /api/auth/login", () => {
  it("blocks login before the email is verified", async () => {
    const email = uniqueEmail("unverified-login");
    await request(app).post("/api/auth/register").send({
      role: "CUSTOMER",
      email,
      password: "correct-horse-battery-staple",
      firstName: "Jan",
      lastName: "Kowalski",
    });

    const response = await request(app).post("/api/auth/login").send({ email, password: "correct-horse-battery-staple" });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("EMAIL_NOT_VERIFIED");
  });

  it("rejects a wrong password with a generic 401 (no user enumeration)", async () => {
    const email = uniqueEmail("wrong-pw");
    await request(app).post("/api/auth/register").send({
      role: "CUSTOMER",
      email,
      password: "correct-horse-battery-staple",
      firstName: "Jan",
      lastName: "Kowalski",
    });

    const response = await request(app).post("/api/auth/login").send({ email, password: "totally-wrong" });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("logs in after verification, sets cookies, and GET /api/users/me returns the same user", async () => {
    const email = uniqueEmail("verified-login");
    const registerResponse = await request(app).post("/api/auth/register").send({
      role: "CUSTOMER",
      email,
      password: "correct-horse-battery-staple",
      firstName: "Jan",
      lastName: "Kowalski",
    });

    await prisma.user.update({ where: { id: registerResponse.body.user.id }, data: { emailVerified: true } });

    const agent = request.agent(app);
    const loginResponse = await agent.post("/api/auth/login").send({ email, password: "correct-horse-battery-staple" });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.headers["set-cookie"]).toBeDefined();

    const meResponse = await agent.get("/api/users/me");
    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user.email).toBe(email);
  });
});

describe("GET /api/users/me", () => {
  it("returns 401 when no session cookie is present", async () => {
    const response = await request(app).get("/api/users/me");
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("NOT_AUTHENTICATED");
  });
});

describe("POST /api/auth/forgot-password", () => {
  it("responds 200 even for an email that doesn't exist (no user enumeration)", async () => {
    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "definitely-not-registered@example.com" });

    expect(response.status).toBe(200);
  });
});
