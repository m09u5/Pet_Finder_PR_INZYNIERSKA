import { existsSync } from "node:fs";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/config/prisma";
import { hashPassword } from "../src/utils/password";
import { JPEG_BYTES, removeUploadedFiles } from "./helpers/animals";

const app = createApp();
const createdEmails: string[] = [];

function uniqueEmail(label: string) {
  const email = `test-breeders-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  createdEmails.push(email);
  return email;
}

async function loginAgent(email: string, password: string) {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send({ email, password });
  return agent;
}

afterAll(async () => {
  await removeUploadedFiles(createdEmails);
  await prisma.user.deleteMany({ where: { email: { in: createdEmails } } });
  await prisma.$disconnect();
});

describe("GET /api/breeders/me", () => {
  it("returns 401 without a session", async () => {
    const response = await request(app).get("/api/breeders/me");
    expect(response.status).toBe(401);
  });

  it("returns 403 for a CUSTOMER", async () => {
    const email = uniqueEmail("customer");
    const password = "correct-horse-battery-staple";
    await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        firstName: "Jan",
        lastName: "Klient",
        role: "CUSTOMER",
        emailVerified: true,
      },
    });

    const agent = await loginAgent(email, password);
    const response = await agent.get("/api/breeders/me");
    expect(response.status).toBe(403);
  });

  it("returns the caller's own breeder profile", async () => {
    const email = uniqueEmail("breeder");
    const password = "correct-horse-battery-staple";
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        firstName: "Ola",
        lastName: "Hodowca",
        role: "BREEDER",
        emailVerified: true,
      },
    });
    await prisma.breederProfile.create({
      data: {
        userId: user.id,
        breedingName: "Psia Buda",
        verificationStatus: "VERIFIED",
        street: "ul. Leśna 5",
        city: "Gdańsk",
        postalCode: "80-100",
      },
    });

    const agent = await loginAgent(email, password);
    const response = await agent.get("/api/breeders/me");

    expect(response.status).toBe(200);
    expect(response.body.breeder.breedingName).toBe("Psia Buda");
    expect(response.body.breeder.userId).toBe(user.id);
  });
});

describe("PATCH /api/breeders/me", () => {
  it("returns 401 without a session", async () => {
    const response = await request(app).patch("/api/breeders/me").send({ description: "Nowy opis" });
    expect(response.status).toBe(401);
  });

  it("lets the breeder update their own description, leaving breedingName untouched", async () => {
    const email = uniqueEmail("update-description");
    const password = "correct-horse-battery-staple";
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        firstName: "Ola",
        lastName: "Hodowca",
        role: "BREEDER",
        emailVerified: true,
      },
    });
    await prisma.breederProfile.create({
      data: {
        userId: user.id,
        breedingName: "Psia Buda",
        description: "Stary opis",
        verificationStatus: "VERIFIED",
        street: "ul. Leśna 5",
        city: "Gdańsk",
        postalCode: "80-100",
      },
    });

    const agent = await loginAgent(email, password);
    const response = await agent.patch("/api/breeders/me").send({ description: "Nowy, lepszy opis hodowli." });

    expect(response.status).toBe(200);
    expect(response.body.breeder.description).toBe("Nowy, lepszy opis hodowli.");
    expect(response.body.breeder.breedingName).toBe("Psia Buda");
  });
});

describe("breeder logo", () => {
  async function createBreeder() {
    const email = uniqueEmail("logo");
    const password = "correct-horse-battery-staple";
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        firstName: "Ola",
        lastName: "Logo",
        role: "BREEDER",
        emailVerified: true,
      },
    });
    const profile = await prisma.breederProfile.create({
      data: {
        userId: user.id,
        breedingName: "Hodowla z logo",
        street: "ul. Leśna 5",
        city: "Gdańsk",
        postalCode: "80-100",
      },
    });
    return { agent: await loginAgent(email, password), profile };
  }

  function storedFile(storagePath: string) {
    return path.join(process.cwd(), "uploads", storagePath);
  }

  async function findLogoPath(breederId: string) {
    const breeder = await prisma.breederProfile.findUniqueOrThrow({ where: { id: breederId } });
    return breeder.logoStoragePath;
  }

  it("stores the logo in a separate folder, replaces it and removes it", async () => {
    const { agent, profile } = await createBreeder();

    const first = await agent.post("/api/breeders/me/logo").attach("logo", JPEG_BYTES, "logo.jpg");
    const firstPath = await findLogoPath(profile.id);

    expect(first.status).toBe(200);
    expect(firstPath).toMatch(new RegExp(`^breeder-logos/${profile.id}/`));
    expect(first.body.breeder.logoUrl).toContain(firstPath);
    expect(existsSync(storedFile(firstPath!))).toBe(true);

    await agent.post("/api/breeders/me/logo").attach("logo", JPEG_BYTES, "new.jpg");
    const secondPath = await findLogoPath(profile.id);

    expect(secondPath).not.toBe(firstPath);
    expect(existsSync(storedFile(firstPath!))).toBe(false);

    const removed = await agent.delete("/api/breeders/me/logo");

    expect(removed.status).toBe(200);
    expect(removed.body.breeder.logoUrl).toBeNull();
    expect(existsSync(storedFile(secondPath!))).toBe(false);
  });

  it("rejects a missing file, a non-image and more than one file", async () => {
    const { agent, profile } = await createBreeder();

    const missing = await agent.post("/api/breeders/me/logo");
    const notAnImage = await agent.post("/api/breeders/me/logo").attach("logo", Buffer.from("text"), "logo.jpg");
    const tooMany = await agent
      .post("/api/breeders/me/logo")
      .attach("logo", JPEG_BYTES, "a.jpg")
      .attach("logo", JPEG_BYTES, "b.jpg");

    expect([missing, notAnImage, tooMany].map((response) => response.body.error.code)).toEqual([
      "NO_FILES",
      "INVALID_FILE_TYPE",
      "INVALID_UPLOAD",
    ]);
    expect(await findLogoPath(profile.id)).toBeNull();
  });

  it("requires a breeder session", async () => {
    const response = await request(app).post("/api/breeders/me/logo");

    expect(response.status).toBe(401);
  });
});
