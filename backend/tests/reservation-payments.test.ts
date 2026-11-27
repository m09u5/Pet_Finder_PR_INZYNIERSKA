import { afterAll, describe, expect, it } from "vitest";
import { getPickupDateRange } from "@pet-finder/shared";
import { prisma } from "../src/config/prisma";
import { cleanUpReservationData, createCustomer, createReservationFor, pay } from "./helpers/reservations";

afterAll(cleanUpReservationData);

describe("GET /api/reservations/:id", () => {
  it("returns the reservation with deposit and pickup address to its owner", async () => {
    const { customer, reservationId } = await createReservationFor("details");

    const response = await customer.agent.get(`/api/reservations/${reservationId}`);

    expect(response.status).toBe(200);
    expect(response.body.reservation.depositAmount).toBe(350);
    expect(response.body.reservation.paidAt).toBeNull();
    expect(response.body.reservation.offer.city).toBe("Warszawa");
  });

  it("returns 403 to another customer", async () => {
    const { reservationId } = await createReservationFor("details-owner");
    const intruder = await createCustomer("details-intruder");

    const response = await intruder.agent.get(`/api/reservations/${reservationId}`);

    expect(response.status).toBe(403);
  });
});

describe("PATCH /api/reservations/:id/pay", () => {
  it("stores the pickup date and deposit, leaving the reservation PENDING for the breeder", async () => {
    const { customer, animalId, reservationId } = await createReservationFor("pay");
    const pickupDate = getPickupDateRange().max;

    const response = await pay(customer.agent, reservationId, pickupDate);

    expect(response.status).toBe(200);
    expect(response.body.reservation.status).toBe("PENDING");
    expect(response.body.reservation.pickupDate).toBe(pickupDate);
    expect(response.body.reservation.paidAt).not.toBeNull();
    const animal = await prisma.animal.findUnique({ where: { id: animalId } });
    expect(animal?.status).toBe("RESERVED");
  });

  it("keeps the paid deposit when the price changes later", async () => {
    const { customer, animalId, reservationId } = await createReservationFor("pay-snapshot");
    await pay(customer.agent, reservationId);
    await prisma.animal.update({ where: { id: animalId }, data: { price: 9000 } });

    const response = await customer.agent.get(`/api/reservations/${reservationId}`);

    expect(response.body.reservation.depositAmount).toBe(350);
  });

  it("rejects a pickup date that is past, too distant or malformed", async () => {
    const { customer, reservationId } = await createReservationFor("pay-date");

    for (const pickupDate of ["2000-01-01", "2999-01-01", "jutro"]) {
      const response = await pay(customer.agent, reservationId, pickupDate);
      expect(response.status).toBe(400);
    }
  });

  it("returns 403 to another customer", async () => {
    const { reservationId } = await createReservationFor("pay-owner");
    const intruder = await createCustomer("pay-intruder");

    const response = await pay(intruder.agent, reservationId);

    expect(response.status).toBe(403);
  });

  it("accepts only one of two simultaneous payments", async () => {
    const { customer, reservationId } = await createReservationFor("pay-race");

    const responses = await Promise.all([pay(customer.agent, reservationId), pay(customer.agent, reservationId)]);

    expect(responses.filter((response) => response.status === 200)).toHaveLength(1);
  });

  it("rejects paying a cancelled reservation", async () => {
    const { customer, reservationId } = await createReservationFor("pay-cancelled");
    await customer.agent.patch(`/api/reservations/${reservationId}/cancel`);

    const response = await pay(customer.agent, reservationId);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_STATUS");
  });
});

describe("PATCH /api/reservations/:id/confirm after payment", () => {
  it("rejects confirming an unpaid reservation", async () => {
    const { breeder, reservationId } = await createReservationFor("confirm-unpaid");

    const response = await breeder.agent.patch(`/api/reservations/${reservationId}/confirm`);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("PAYMENT_REQUIRED");
  });

  it("keeps the animal consistent when confirm and cancel race each other", async () => {
    const { breeder, customer, animalId, reservationId } = await createReservationFor("confirm-cancel-race");
    await pay(customer.agent, reservationId);

    const responses = await Promise.all([
      breeder.agent.patch(`/api/reservations/${reservationId}/confirm`),
      customer.agent.patch(`/api/reservations/${reservationId}/cancel`),
    ]);

    expect(responses.filter((response) => response.status === 200)).toHaveLength(1);
    const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
    const animal = await prisma.animal.findUnique({ where: { id: animalId } });
    expect(animal?.status).toBe(reservation?.status === "CONFIRMED" ? "SOLD" : "AVAILABLE");
  });
});
