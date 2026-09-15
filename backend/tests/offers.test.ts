import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/config/prisma";
import { hashPassword } from "../src/utils/password";

const app = createApp();
const createdEmails: string[] = [];

function uniqueEmail(label: string) {
  const email = `test-offers-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  createdEmails.push(email);
  return email;
}

async function loginAgent(email: string, password: string) {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send({ email, password });
  return agent;
}

async function createVerifiedBreeder(label: string) {
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
  return { email, password, user, profile };
}

const animalPayload = {
  name: "Luna",
  species: "cat",
  breed: "Ragdoll",
  sex: "FEMALE",
  birthDate: "2024-03-15",
  price: 3500,
};

function uniqueSpecies(label: string) {
  return `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function setBreederLocation(breederId: string, latitude: number, longitude: number) {
  return prisma.breederProfile.update({ where: { id: breederId }, data: { latitude, longitude } });
}

let customerEmail: string;
const customerPassword = "correct-horse-battery-staple";
let pendingBreederEmail: string;
const pendingBreederPassword = "correct-horse-battery-staple";

beforeAll(async () => {
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

  pendingBreederEmail = uniqueEmail("pending-breeder");
  const pendingUser = await prisma.user.create({
    data: {
      email: pendingBreederEmail,
      passwordHash: await hashPassword(pendingBreederPassword),
      firstName: "Niezweryfikowany",
      lastName: "Hodowca",
      role: "BREEDER",
      emailVerified: true,
    },
  });
  await prisma.breederProfile.create({
    data: {
      userId: pendingUser.id,
      breedingName: "Hodowla Pending",
      verificationStatus: "PENDING",
      street: "ul. Testowa 1",
      city: "Warszawa",
      postalCode: "00-001",
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { in: createdEmails } } });
  await prisma.$disconnect();
});

describe("POST /api/offers", () => {
  it("returns 403 for a CUSTOMER", async () => {
    const agent = await loginAgent(customerEmail, customerPassword);
    const response = await agent.post("/api/offers").send({ animal: animalPayload });
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("INSUFFICIENT_ROLE");
  });

  it("returns 403 for a BREEDER pending verification", async () => {
    const agent = await loginAgent(pendingBreederEmail, pendingBreederPassword);
    const response = await agent.post("/api/offers").send({ animal: animalPayload });
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("BREEDER_NOT_VERIFIED");
  });

  it("creates the breeder's Offer with its first Animal, auto-titled from the hodowla name", async () => {
    const breeder = await createVerifiedBreeder("create");
    const agent = await loginAgent(breeder.email, breeder.password);

    const response = await agent.post("/api/offers").send({ animal: animalPayload });

    expect(response.status).toBe(201);
    expect(response.body.offer.title).toBe(`Zwierzęta z hodowli ${breeder.profile.breedingName}`);
    expect(response.body.offer.status).toBe("ACTIVE");
    expect(response.body.offer.animals).toHaveLength(1);
    expect(response.body.offer.animals[0].breed).toBe("Ragdoll");
    expect(response.body.offer.animals[0].price).toBe(3500);
    expect(response.body.offer.images).toEqual([{ id: "placeholder", url: "/placeholder-pet.svg" }]);
  });

  it("adds a second animal to the same, already-existing Offer instead of creating a new one", async () => {
    const breeder = await createVerifiedBreeder("second-animal");
    const agent = await loginAgent(breeder.email, breeder.password);

    const first = await agent.post("/api/offers").send({ animal: animalPayload });
    const second = await agent.post("/api/offers").send({
      animal: { ...animalPayload, name: "Max", sex: "MALE", price: 4000 },
    });

    expect(second.status).toBe(201);
    expect(second.body.offer.id).toBe(first.body.offer.id);
    expect(second.body.offer.animals).toHaveLength(2);

    const offersForBreeder = await prisma.offer.count({ where: { breederId: breeder.profile.id } });
    expect(offersForBreeder).toBe(1);
  });

  it("rejects an invalid payload with 400", async () => {
    const breeder = await createVerifiedBreeder("invalid-payload");
    const agent = await loginAgent(breeder.email, breeder.password);

    const response = await agent.post("/api/offers").send({
      animal: { ...animalPayload, price: -5 },
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects adding an animal of a different species to an existing, single-species offer", async () => {
    const breeder = await createVerifiedBreeder("species-guard");
    const agent = await loginAgent(breeder.email, breeder.password);
    await agent.post("/api/offers").send({ animal: { ...animalPayload, species: "cat" } });

    const response = await agent.post("/api/offers").send({
      animal: { ...animalPayload, name: "Rex", species: "dog" },
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("SPECIES_MISMATCH");

    const animalCount = await prisma.animal.count({ where: { breederId: breeder.profile.id } });
    expect(animalCount).toBe(1);
  });
});

describe("GET /api/offers - filtering, sorting, pagination", () => {
  it("filters by species, excluding offers whose animals don't match", async () => {
    const species = uniqueSpecies("papuga");
    const matching = await createVerifiedBreeder("species-filter-match");
    const other = await createVerifiedBreeder("species-filter-other");
    await loginAgent(matching.email, matching.password).then((agent) =>
      agent.post("/api/offers").send({ animal: { ...animalPayload, species } }),
    );
    await loginAgent(other.email, other.password).then((agent) =>
      agent.post("/api/offers").send({ animal: { ...animalPayload, species: uniqueSpecies("chomik") } }),
    );

    const response = await request(app).get("/api/offers").query({ species });
    expect(response.status).toBe(200);
    const ids = response.body.items.map((item: { breederId: string }) => item.breederId);
    expect(ids).toContain(matching.profile.id);
    expect(ids).not.toContain(other.profile.id);
  });

  it("filters by price range against the offer's matching animal", async () => {
    const species = uniqueSpecies("gryzon");
    const cheap = await createVerifiedBreeder("price-filter-cheap");
    const pricey = await createVerifiedBreeder("price-filter-pricey");
    await loginAgent(cheap.email, cheap.password).then((agent) =>
      agent.post("/api/offers").send({ animal: { ...animalPayload, species, price: 100 } }),
    );
    await loginAgent(pricey.email, pricey.password).then((agent) =>
      agent.post("/api/offers").send({ animal: { ...animalPayload, species, price: 900 } }),
    );

    const response = await request(app).get("/api/offers").query({ species, minPrice: 500, maxPrice: 1000 });
    const ids = response.body.items.map((item: { breederId: string }) => item.breederId);
    expect(ids).toContain(pricey.profile.id);
    expect(ids).not.toContain(cheap.profile.id);
  });

  it("filters by sex", async () => {
    const species = uniqueSpecies("krolik");
    const male = await createVerifiedBreeder("sex-filter-male");
    const female = await createVerifiedBreeder("sex-filter-female");
    await loginAgent(male.email, male.password).then((agent) =>
      agent.post("/api/offers").send({ animal: { ...animalPayload, species, sex: "MALE" } }),
    );
    await loginAgent(female.email, female.password).then((agent) =>
      agent.post("/api/offers").send({ animal: { ...animalPayload, species, sex: "FEMALE" } }),
    );

    const response = await request(app).get("/api/offers").query({ species, sex: "MALE" });
    const ids = response.body.items.map((item: { breederId: string }) => item.breederId);
    expect(ids).toContain(male.profile.id);
    expect(ids).not.toContain(female.profile.id);
  });

  it("matches a keyword against the breeding name", async () => {
    const breeder = await createVerifiedBreeder("keyword");
    const agent = await loginAgent(breeder.email, breeder.password);
    await agent.post("/api/offers").send({ animal: { ...animalPayload, species: uniqueSpecies("keyword-animal") } });

    const response = await request(app).get("/api/offers").query({ q: breeder.profile.breedingName });
    const ids = response.body.items.map((item: { breederId: string }) => item.breederId);
    expect(ids).toContain(breeder.profile.id);
  });

  it("sorts by price ascending/descending using each offer's cheapest available animal", async () => {
    const species = uniqueSpecies("sort");
    const expensive = await createVerifiedBreeder("sort-expensive");
    const cheap = await createVerifiedBreeder("sort-cheap");
    await loginAgent(expensive.email, expensive.password).then((agent) =>
      agent.post("/api/offers").send({ animal: { ...animalPayload, species, price: 800 } }),
    );
    await loginAgent(cheap.email, cheap.password).then((agent) =>
      agent.post("/api/offers").send({ animal: { ...animalPayload, species, price: 100 } }),
    );

    const asc = await request(app).get("/api/offers").query({ species, sort: "price_asc" });
    const ascIds = asc.body.items.map((item: { breederId: string }) => item.breederId);
    expect(ascIds).toEqual([cheap.profile.id, expensive.profile.id]);

    const desc = await request(app).get("/api/offers").query({ species, sort: "price_desc" });
    const descIds = desc.body.items.map((item: { breederId: string }) => item.breederId);
    expect(descIds).toEqual([expensive.profile.id, cheap.profile.id]);
  });

  it("filters by radius around a point and reports distanceKm, excluding offers outside the radius", async () => {
    const species = uniqueSpecies("geo");
    const near = await createVerifiedBreeder("geo-near");
    const far = await createVerifiedBreeder("geo-far");
    await loginAgent(near.email, near.password).then((agent) =>
      agent.post("/api/offers").send({ animal: { ...animalPayload, species } }),
    );
    await loginAgent(far.email, far.password).then((agent) =>
      agent.post("/api/offers").send({ animal: { ...animalPayload, species } }),
    );
    await setBreederLocation(near.profile.id, 51.1079, 17.0385); // Wrocław
    await setBreederLocation(far.profile.id, 52.2297, 21.0122); // Warszawa (~290km away)

    const response = await request(app)
      .get("/api/offers")
      .query({ species, lat: 51.11, lng: 17.03, radiusKm: 50 });

    const ids = response.body.items.map((item: { breederId: string }) => item.breederId);
    expect(ids).toContain(near.profile.id);
    expect(ids).not.toContain(far.profile.id);
    const nearItem = response.body.items.find((item: { breederId: string }) => item.breederId === near.profile.id);
    expect(nearItem.distanceKm).toBeLessThan(50);
  });

  it("rejects radiusKm without a location with 400", async () => {
    const response = await request(app).get("/api/offers").query({ radiusKm: 20 });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects sort=distance without radiusKm with 400", async () => {
    const response = await request(app).get("/api/offers").query({ sort: "distance" });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("paginates results respecting page and limit", async () => {
    const species = uniqueSpecies("page");
    for (const label of ["page-a", "page-b", "page-c"]) {
      const breeder = await createVerifiedBreeder(label);
      const agent = await loginAgent(breeder.email, breeder.password);
      await agent.post("/api/offers").send({ animal: { ...animalPayload, species } });
    }

    const firstPage = await request(app).get("/api/offers").query({ species, limit: 2, page: 1 });
    const secondPage = await request(app).get("/api/offers").query({ species, limit: 2, page: 2 });

    expect(firstPage.body.total).toBe(3);
    expect(firstPage.body.items).toHaveLength(2);
    expect(secondPage.body.items).toHaveLength(1);
  });
});

describe("GET /api/offers and /api/offers/:id", () => {
  it("lists only ACTIVE offers publicly and includes the placeholder image", async () => {
    const breeder = await createVerifiedBreeder("list");
    const agent = await loginAgent(breeder.email, breeder.password);
    const createResponse = await agent.post("/api/offers").send({ animal: animalPayload });

    const response = await request(app).get("/api/offers");
    expect(response.status).toBe(200);
    const found = response.body.items.find((item: { id: string }) => item.id === createResponse.body.offer.id);
    expect(found).toBeDefined();
    expect(found.images[0].url).toBe("/placeholder-pet.svg");
    expect(found.animals).toHaveLength(1);
  });

  it("returns a single offer by id with its animals", async () => {
    const breeder = await createVerifiedBreeder("detail");
    const agent = await loginAgent(breeder.email, breeder.password);
    const createResponse = await agent.post("/api/offers").send({ animal: animalPayload });

    const response = await request(app).get(`/api/offers/${createResponse.body.offer.id}`);
    expect(response.status).toBe(200);
    expect(response.body.offer.animals[0].name).toBe("Luna");
  });

  it("returns 404 for a non-existent offer", async () => {
    const response = await request(app).get("/api/offers/00000000-0000-0000-0000-000000000000");
    expect(response.status).toBe(404);
  });
});

describe("PUT /api/offers/:id/animals/:animalId", () => {
  it("returns 403 when a different breeder tries to edit the animal", async () => {
    const owner = await createVerifiedBreeder("owner");
    const ownerAgent = await loginAgent(owner.email, owner.password);
    const createResponse = await ownerAgent.post("/api/offers").send({ animal: animalPayload });
    const animalId = createResponse.body.offer.animals[0].id;

    const intruder = await createVerifiedBreeder("intruder");
    const intruderAgent = await loginAgent(intruder.email, intruder.password);
    const response = await intruderAgent
      .put(`/api/offers/${createResponse.body.offer.id}/animals/${animalId}`)
      .send({ price: 1 });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("NOT_OWNER");
  });

  it("lets the owner update an animal's price and fields", async () => {
    const breeder = await createVerifiedBreeder("editor");
    const agent = await loginAgent(breeder.email, breeder.password);
    const createResponse = await agent.post("/api/offers").send({ animal: animalPayload });
    const animalId = createResponse.body.offer.animals[0].id;

    const response = await agent
      .put(`/api/offers/${createResponse.body.offer.id}/animals/${animalId}`)
      .send({ name: "Bella", price: 3300 });

    expect(response.status).toBe(200);
    const updated = response.body.offer.animals.find((a: { id: string }) => a.id === animalId);
    expect(updated.name).toBe("Bella");
    expect(updated.price).toBe(3300);
  });
});

describe("DELETE /api/offers/:id", () => {
  it("deactivates the offer and removes it from the public listing", async () => {
    const breeder = await createVerifiedBreeder("deactivate");
    const agent = await loginAgent(breeder.email, breeder.password);
    const createResponse = await agent.post("/api/offers").send({ animal: animalPayload });
    const offerId = createResponse.body.offer.id;

    const deleteResponse = await agent.delete(`/api/offers/${offerId}`);
    expect(deleteResponse.status).toBe(204);

    const listResponse = await request(app).get("/api/offers");
    expect(listResponse.body.items.find((item: { id: string }) => item.id === offerId)).toBeUndefined();

    const updated = await prisma.offer.findUnique({ where: { id: offerId } });
    expect(updated?.status).toBe("INACTIVE");
  });
});

describe("GET /api/offers/mine", () => {
  it("returns null when the breeder has no offer yet", async () => {
    const breeder = await createVerifiedBreeder("no-offer-yet");
    const agent = await loginAgent(breeder.email, breeder.password);

    const response = await agent.get("/api/offers/mine");
    expect(response.status).toBe(200);
    expect(response.body.offer).toBeNull();
  });

  it("returns the breeder's own offer with all its animals", async () => {
    const breeder = await createVerifiedBreeder("mine");
    const agent = await loginAgent(breeder.email, breeder.password);
    await agent.post("/api/offers").send({ animal: animalPayload });
    await agent.post("/api/offers").send({ animal: { ...animalPayload, name: "Max", price: 4000 } });

    const response = await agent.get("/api/offers/mine");
    expect(response.status).toBe(200);
    expect(response.body.offer.animals).toHaveLength(2);
  });
});
