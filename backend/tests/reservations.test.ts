import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "../src/config/prisma";
import { cleanUpReservationData, createCustomer, createVerifiedBreederWithAnimal, pay } from "./helpers/reservations";

afterAll(cleanUpReservationData);

describe("POST /api/reservations", () => {
  it("returns 403 for a BREEDER trying to reserve", async () => {
    const breeder = await createVerifiedBreederWithAnimal("self-reserve");
    const animalId = breeder.offer.animals[0].id;

    const response = await breeder.agent.post("/api/reservations").send({ animalId });
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("INSUFFICIENT_ROLE");
  });

  it("creates a PENDING reservation and immediately flips the animal to RESERVED", async () => {
    const breeder = await createVerifiedBreederWithAnimal("create");
    const animalId = breeder.offer.animals[0].id;
    const customer = await createCustomer("create");

    const response = await customer.agent.post("/api/reservations").send({ animalId });

    expect(response.status).toBe(201);
    expect(response.body.reservation.status).toBe("PENDING");
    expect(response.body.reservation.animal.id).toBe(animalId);
    expect(response.body.reservation.customer.email).toBe(customer.email);

    const animal = await prisma.animal.findUnique({ where: { id: animalId } });
    expect(animal?.status).toBe("RESERVED");
  });

  it("rejects reserving an already-reserved animal with 409", async () => {
    const breeder = await createVerifiedBreederWithAnimal("double-book");
    const animalId = breeder.offer.animals[0].id;
    const firstCustomer = await createCustomer("double-book-first");
    const secondCustomer = await createCustomer("double-book-second");

    await firstCustomer.agent.post("/api/reservations").send({ animalId });
    const response = await secondCustomer.agent.post("/api/reservations").send({ animalId });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("ANIMAL_NOT_AVAILABLE");
  });

  it("only lets one of two simultaneous reservation attempts on the same animal succeed", async () => {
    const breeder = await createVerifiedBreederWithAnimal("race");
    const animalId = breeder.offer.animals[0].id;
    const customerA = await createCustomer("race-a");
    const customerB = await createCustomer("race-b");

    const [responseA, responseB] = await Promise.all([
      customerA.agent.post("/api/reservations").send({ animalId }),
      customerB.agent.post("/api/reservations").send({ animalId }),
    ]);

    const statuses = [responseA.status, responseB.status].sort();
    expect(statuses).toEqual([201, 409]);

    const activeReservations = await prisma.reservation.count({
      where: { animalId, status: { in: ["PENDING", "CONFIRMED"] } },
    });
    expect(activeReservations).toBe(1);
  });

  it("returns 404 for a non-existent animal", async () => {
    const customer = await createCustomer("missing-animal");
    const response = await customer.agent
      .post("/api/reservations")
      .send({ animalId: "00000000-0000-0000-0000-000000000000" });
    expect(response.status).toBe(404);
  });
});

describe("GET /api/reservations/mine and /incoming", () => {
  it("lists the customer's own reservation and the breeder's incoming reservation for the same record", async () => {
    const breeder = await createVerifiedBreederWithAnimal("lists");
    const animalId = breeder.offer.animals[0].id;
    const customer = await createCustomer("lists");
    const created = await customer.agent.post("/api/reservations").send({ animalId });

    const mine = await customer.agent.get("/api/reservations/mine");
    expect(mine.status).toBe(200);
    expect(mine.body.reservations.map((r: { id: string }) => r.id)).toContain(created.body.reservation.id);

    const incoming = await breeder.agent.get("/api/reservations/incoming");
    expect(incoming.status).toBe(200);
    expect(incoming.body.reservations.map((r: { id: string }) => r.id)).toContain(created.body.reservation.id);
  });
});

describe("PATCH /api/reservations/:id/confirm", () => {
  it("returns 403 when a different breeder tries to confirm", async () => {
    const breeder = await createVerifiedBreederWithAnimal("confirm-owner");
    const animalId = breeder.offer.animals[0].id;
    const customer = await createCustomer("confirm-owner");
    const created = await customer.agent.post("/api/reservations").send({ animalId });

    const intruder = await createVerifiedBreederWithAnimal("confirm-intruder");
    const response = await intruder.agent.patch(`/api/reservations/${created.body.reservation.id}/confirm`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("NOT_OWNER");
  });

  it("lets the owning breeder confirm a PENDING reservation, marking the animal SOLD", async () => {
    const breeder = await createVerifiedBreederWithAnimal("confirm-success");
    const animalId = breeder.offer.animals[0].id;
    const customer = await createCustomer("confirm-success");
    const created = await customer.agent.post("/api/reservations").send({ animalId });
    await pay(customer.agent, created.body.reservation.id);

    const response = await breeder.agent.patch(`/api/reservations/${created.body.reservation.id}/confirm`);

    expect(response.status).toBe(200);
    expect(response.body.reservation.status).toBe("CONFIRMED");

    const animal = await prisma.animal.findUnique({ where: { id: animalId } });
    expect(animal?.status).toBe("SOLD");
  });

  it("rejects confirming a reservation that isn't PENDING", async () => {
    const breeder = await createVerifiedBreederWithAnimal("confirm-twice");
    const animalId = breeder.offer.animals[0].id;
    const customer = await createCustomer("confirm-twice");
    const created = await customer.agent.post("/api/reservations").send({ animalId });
    await pay(customer.agent, created.body.reservation.id);
    await breeder.agent.patch(`/api/reservations/${created.body.reservation.id}/confirm`);

    const response = await breeder.agent.patch(`/api/reservations/${created.body.reservation.id}/confirm`);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_STATUS");
  });
});

describe("PATCH /api/reservations/:id/cancel", () => {
  it("lets the customer cancel their own PENDING reservation, freeing the animal", async () => {
    const breeder = await createVerifiedBreederWithAnimal("cancel-customer");
    const animalId = breeder.offer.animals[0].id;
    const customer = await createCustomer("cancel-customer");
    const created = await customer.agent.post("/api/reservations").send({ animalId });

    const response = await customer.agent.patch(`/api/reservations/${created.body.reservation.id}/cancel`);

    expect(response.status).toBe(200);
    expect(response.body.reservation.status).toBe("CANCELLED");

    const animal = await prisma.animal.findUnique({ where: { id: animalId } });
    expect(animal?.status).toBe("AVAILABLE");
  });

  it("lets the owning breeder cancel a PENDING reservation too", async () => {
    const breeder = await createVerifiedBreederWithAnimal("cancel-breeder");
    const animalId = breeder.offer.animals[0].id;
    const customer = await createCustomer("cancel-breeder");
    const created = await customer.agent.post("/api/reservations").send({ animalId });

    const response = await breeder.agent.patch(`/api/reservations/${created.body.reservation.id}/cancel`);

    expect(response.status).toBe(200);
    expect(response.body.reservation.status).toBe("CANCELLED");
  });

  it("returns 403 when an unrelated customer tries to cancel someone else's reservation", async () => {
    const breeder = await createVerifiedBreederWithAnimal("cancel-intruder");
    const animalId = breeder.offer.animals[0].id;
    const customer = await createCustomer("cancel-intruder-owner");
    const created = await customer.agent.post("/api/reservations").send({ animalId });

    const intruder = await createCustomer("cancel-intruder");
    const response = await intruder.agent.patch(`/api/reservations/${created.body.reservation.id}/cancel`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("NOT_OWNER");
  });

  it("allows reserving the animal again after a cancellation", async () => {
    const breeder = await createVerifiedBreederWithAnimal("cancel-then-reserve");
    const animalId = breeder.offer.animals[0].id;
    const firstCustomer = await createCustomer("cancel-then-reserve-first");
    const created = await firstCustomer.agent.post("/api/reservations").send({ animalId });
    await firstCustomer.agent.patch(`/api/reservations/${created.body.reservation.id}/cancel`);

    const secondCustomer = await createCustomer("cancel-then-reserve-second");
    const response = await secondCustomer.agent.post("/api/reservations").send({ animalId });

    expect(response.status).toBe(201);
  });
});
