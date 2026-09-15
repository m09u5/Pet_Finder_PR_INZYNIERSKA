import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@petfinder.local" },
    update: {},
    create: {
      email: "admin@petfinder.local",
      passwordHash: adminPasswordHash,
      firstName: "Admin",
      lastName: "Pet Finder",
      role: "ADMIN",
      emailVerified: true,
    },
  });

  const customerPasswordHash = await bcrypt.hash("Customer123!", 12);
  await prisma.user.upsert({
    where: { email: "customer@petfinder.local" },
    update: {},
    create: {
      email: "customer@petfinder.local",
      passwordHash: customerPasswordHash,
      firstName: "Kuba",
      lastName: "Nowak",
      role: "CUSTOMER",
      emailVerified: true,
    },
  });

  const breederPasswordHash = await bcrypt.hash("Breeder123!", 12);
  const breederUser = await prisma.user.upsert({
    where: { email: "breeder@petfinder.local" },
    update: {},
    create: {
      email: "breeder@petfinder.local",
      passwordHash: breederPasswordHash,
      firstName: "Bartek",
      lastName: "Marcinow",
      role: "BREEDER",
      emailVerified: true,
    },
  });

  const breederProfile = await prisma.breederProfile.upsert({
    where: { userId: breederUser.id },
    update: {
      street: "ul. Świdnicka 8",
      city: "Wrocław",
      postalCode: "50-067",
      latitude: 51.1079,
      longitude: 17.0385,
    },
    create: {
      userId: breederUser.id,
      breedingName: "Kocia Przystań",
      description: "Rodzinna hodowla kotów rasy ragdoll.",
      verificationStatus: "VERIFIED",
      street: "ul. Świdnicka 8",
      city: "Wrocław",
      postalCode: "50-067",
      latitude: 51.1079,
      longitude: 17.0385,
    },
  });

  let offer = await prisma.offer.findUnique({ where: { breederId: breederProfile.id } });
  if (!offer) {
    offer = await prisma.offer.create({
      data: {
        breederId: breederProfile.id,
        title: "Zwierzęta z hodowli Kocia Przystań",
        status: "ACTIVE",
        animals: {
          create: {
            breederId: breederProfile.id,
            name: "Luna",
            species: "cat",
            breed: "Ragdoll",
            sex: "FEMALE",
            birthDate: new Date("2024-03-15"),
            description: "Towarzyska, przyjazna dzieciom, odrobaczona i zaszczepiona.",
            price: 3500,
            status: "AVAILABLE",
          },
        },
      },
    });
  }

  const milo = await prisma.animal.findFirst({ where: { offerId: offer.id, name: "Milo" } });
  if (!milo) {
    await prisma.animal.create({
      data: {
        breederId: breederProfile.id,
        offerId: offer.id,
        name: "Milo",
        species: "cat",
        breed: "Ragdoll",
        sex: "MALE",
        birthDate: new Date("2024-04-02"),
        description: "Spokojny, przytulaśny kocur, przyzwyczajony do kuwety.",
        price: 3800,
        status: "AVAILABLE",
      },
    });
  }

  console.log("Seed complete:");
  console.log("  admin@petfinder.local / Admin123!");
  console.log("  breeder@petfinder.local / Breeder123! (VERIFIED, Kocia Przystań, kot Ragdoll)");
  console.log("  customer@petfinder.local / Customer123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
