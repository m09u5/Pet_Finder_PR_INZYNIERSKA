import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "../src/config/prisma";
import { expireUnpaidReservations } from "../src/services/reservation.service";
import { cleanUpReservationData, createCustomer, createReservationFor, pay } from "./helpers/reservations";

const DAY_MS = 24 * 60 * 60 * 1000;

function backdate(reservationId: string, days: number) {
  return prisma.reservation.update({
    where: { id: reservationId },
    data: { createdAt: new Date(Date.now() - days * DAY_MS) },
  });
}

async function findAnimalStatus(animalId: string) {
  return (await prisma.animal.findUnique({ where: { id: animalId } }))?.status;
}

afterAll(cleanUpReservationData);

describe("unpaid reservation expiry", () => {
  it("cancels a reservation unpaid for over 3 days and lets someone else reserve the animal", async () => {
    const { customer, animalId, reservationId } = await createReservationFor("expiry-overdue");
    await backdate(reservationId, 3.01);

    await expireUnpaidReservations();

    const response = await customer.agent.get(`/api/reservations/${reservationId}`);
    expect(response.body.reservation.status).toBe("CANCELLED");
    expect(response.body.reservation.isExpired).toBe(true);
    expect(await findAnimalStatus(animalId)).toBe("AVAILABLE");

    const next = await createCustomer("expiry-next");
    const reserved = await next.agent.post("/api/reservations").send({ animalId });
    expect(reserved.status).toBe(201);
  });

  it("keeps an unpaid reservation that is younger than 3 days", async () => {
    const { animalId, reservationId } = await createReservationFor("expiry-fresh");
    await backdate(reservationId, 2.9);

    await expireUnpaidReservations();

    const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
    expect(reservation?.status).toBe("PENDING");
    expect(await findAnimalStatus(animalId)).toBe("RESERVED");
  });

  it("never expires a paid reservation waiting for the breeder", async () => {
    const { customer, animalId, reservationId } = await createReservationFor("expiry-paid");
    await pay(customer.agent, reservationId);
    await backdate(reservationId, 10);

    await expireUnpaidReservations();

    const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
    expect(reservation?.status).toBe("PENDING");
    expect(await findAnimalStatus(animalId)).toBe("RESERVED");
  });

  it("rejects a payment made after the deadline", async () => {
    const { customer, reservationId } = await createReservationFor("expiry-late-payment");
    await backdate(reservationId, 3.01);

    const response = await pay(customer.agent, reservationId);

    expect(response.status).toBe(400);
    expect(["PAYMENT_EXPIRED", "INVALID_STATUS"]).toContain(response.body.error.code);
  });

  it("does not mark a reservation cancelled by the customer as expired", async () => {
    const { customer, reservationId } = await createReservationFor("expiry-manual");

    const response = await customer.agent.patch(`/api/reservations/${reservationId}/cancel`);

    expect(response.body.reservation.isExpired).toBe(false);
  });
});
