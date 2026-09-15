import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/config/prisma";
import { hashPassword } from "../src/utils/password";

const app = createApp();
const createdEmails: string[] = [];

function uniqueEmail(label: string) {
  const email = `test-images-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  createdEmails.push(email);
  return email;
}

async function loginAgent(email: string, password: string) {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send({ email, password });
  return agent;
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

const JPEG_BYTES = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
const NOT_AN_IMAGE = Buffer.from("this is definitely not an image file");

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { in: createdEmails } } });
  await prisma.$disconnect();
});

describe("POST /api/offers/:id/images", () => {
  it("returns 401 without a session", async () => {
    const response = await request(app).post("/api/offers/00000000-0000-0000-0000-000000000000/images");
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
    const response = await agent
      .post("/api/offers/00000000-0000-0000-0000-000000000000/images")
      .attach("images", JPEG_BYTES, "photo.jpg");
    expect(response.status).toBe(403);
  });

  it("rejects a file whose content is not actually an image, regardless of its extension", async () => {
    const breeder = await createVerifiedBreederWithOffer("bad-file");
    const response = await breeder.agent
      .post(`/api/offers/${breeder.offer.id}/images`)
      .attach("images", NOT_AN_IMAGE, "totally-a-photo.jpg");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_FILE_TYPE");
  });

  it("uploads a valid image to the offer gallery", async () => {
    const breeder = await createVerifiedBreederWithOffer("offer-gallery");
    const response = await breeder.agent
      .post(`/api/offers/${breeder.offer.id}/images`)
      .attach("images", JPEG_BYTES, "photo.jpg");

    expect(response.status).toBe(201);
    expect(response.body.images).toHaveLength(1);
    expect(response.body.images[0].url).toBeTruthy();

    const offerResponse = await request(app).get(`/api/offers/${breeder.offer.id}`);
    expect(offerResponse.body.offer.images).toHaveLength(1);
    expect(offerResponse.body.offer.images[0].id).not.toBe("placeholder");
  });
});

describe("POST /api/offers/:id/animals/:animalId/images", () => {
  it("uploads a photo scoped to one specific animal, not the offer gallery", async () => {
    const breeder = await createVerifiedBreederWithOffer("animal-gallery");
    const animalId = breeder.offer.animals[0].id;

    const response = await breeder.agent
      .post(`/api/offers/${breeder.offer.id}/animals/${animalId}/images`)
      .attach("images", JPEG_BYTES, "cat.jpg");

    expect(response.status).toBe(201);

    const offerResponse = await request(app).get(`/api/offers/${breeder.offer.id}`);
    const animal = offerResponse.body.offer.animals.find((a: { id: string }) => a.id === animalId);
    expect(animal.images).toHaveLength(1);
    expect(animal.images[0].id).not.toBe("placeholder");
    expect(offerResponse.body.offer.images[0].id).toBe("placeholder");
  });
});

describe("DELETE /api/images/:id", () => {
  it("returns 403 when a different breeder tries to delete the image", async () => {
    const breeder = await createVerifiedBreederWithOffer("delete-owner");
    const uploadResponse = await breeder.agent
      .post(`/api/offers/${breeder.offer.id}/images`)
      .attach("images", JPEG_BYTES, "photo.jpg");
    const imageId = uploadResponse.body.images[0].id;

    const intruder = await createVerifiedBreederWithOffer("delete-intruder");
    const response = await intruder.agent.delete(`/api/images/${imageId}`);

    expect(response.status).toBe(403);
  });

  it("lets the owner delete their own image", async () => {
    const breeder = await createVerifiedBreederWithOffer("delete-success");
    const uploadResponse = await breeder.agent
      .post(`/api/offers/${breeder.offer.id}/images`)
      .attach("images", JPEG_BYTES, "photo.jpg");
    const imageId = uploadResponse.body.images[0].id;

    const deleteResponse = await breeder.agent.delete(`/api/images/${imageId}`);
    expect(deleteResponse.status).toBe(204);

    const offerResponse = await request(app).get(`/api/offers/${breeder.offer.id}`);
    expect(offerResponse.body.offer.images[0].id).toBe("placeholder");
  });
});
