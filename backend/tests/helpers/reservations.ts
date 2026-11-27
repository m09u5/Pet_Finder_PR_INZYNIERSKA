import request from "supertest";
import { getPickupDateRange } from "@pet-finder/shared";
import { createApp } from "../../src/app";
import { prisma } from "../../src/config/prisma";
import { hashPassword } from "../../src/utils/password";
import { postAnimal, removeUploadedFiles } from "./animals";

const app = createApp();
const createdEmails: string[] = [];

function uniqueEmail(label: string) {
  const email = `test-reservations-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  createdEmails.push(email);
  return email;
}

async function loginAgent(email: string, password: string) {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send({ email, password });
  return agent;
}

export async function createCustomer(label: string) {
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

export async function createVerifiedBreederWithAnimal(label: string) {
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
  const createResponse = await postAnimal(agent, {
      name: "Luna",
      species: "cat",
      breed: "Ragdoll",
      sex: "FEMALE",
      birthDate: "2024-03-15",
      price: 3500,
    });
  return { email, password, user, profile, agent, offer: createResponse.body.offer };
}

export async function createReservationFor(label: string) {
  const breeder = await createVerifiedBreederWithAnimal(label);
  const animalId: string = breeder.offer.animals[0].id;
  const customer = await createCustomer(label);
  const created = await customer.agent.post("/api/reservations").send({ animalId });
  const reservationId: string = created.body.reservation.id;
  return { breeder, customer, animalId, reservationId };
}

export function pay(agent: ReturnType<typeof request.agent>, reservationId: string, pickupDate = getPickupDateRange().max) {
  return agent.patch(`/api/reservations/${reservationId}/pay`).send({ pickupDate });
}

export async function cleanUpReservationData() {
  await removeUploadedFiles(createdEmails);
  await prisma.user.deleteMany({ where: { email: { in: createdEmails } } });
  await prisma.$disconnect();
}
