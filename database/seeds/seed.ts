import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface SeedAnimalInput {
  name: string;
  sex: "MALE" | "FEMALE";
  birthDate: string;
  description: string;
  price: number;
}

interface SeedCatBreederInput {
  email: string;
  firstName: string;
  lastName: string;
  breedingName: string;
  description: string;
  street: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  breed: string;
  animals: SeedAnimalInput[];
}

async function seedCatBreeder(input: SeedCatBreederInput) {
  const passwordHash = await bcrypt.hash("Breeder123!", 12);
  const user = await prisma.user.upsert({
    where: { email: input.email },
    update: {},
    create: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: "BREEDER",
      emailVerified: true,
    },
  });

  const profile = await prisma.breederProfile.upsert({
    where: { userId: user.id },
    update: {
      street: input.street,
      city: input.city,
      postalCode: input.postalCode,
      latitude: input.latitude,
      longitude: input.longitude,
    },
    create: {
      userId: user.id,
      breedingName: input.breedingName,
      description: input.description,
      verificationStatus: "VERIFIED",
      street: input.street,
      city: input.city,
      postalCode: input.postalCode,
      latitude: input.latitude,
      longitude: input.longitude,
    },
  });

  let offer = await prisma.offer.findUnique({ where: { breederId: profile.id } });
  if (!offer) {
    offer = await prisma.offer.create({
      data: {
        breederId: profile.id,
        title: `Zwierzęta z hodowli ${input.breedingName}`,
        status: "ACTIVE",
      },
    });
  }

  for (const animal of input.animals) {
    const existing = await prisma.animal.findFirst({ where: { offerId: offer.id, name: animal.name } });
    if (!existing) {
      await prisma.animal.create({
        data: {
          breederId: profile.id,
          offerId: offer.id,
          name: animal.name,
          species: "cat",
          breed: input.breed,
          sex: animal.sex,
          birthDate: new Date(animal.birthDate),
          description: animal.description,
          price: animal.price,
          status: "AVAILABLE",
        },
      });
    }
  }

  console.log(`  ${input.email} / Breeder123! (VERIFIED, ${input.breedingName}, ${input.breed})`);
}

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

  await seedCatBreeder({
    email: "breeder-british@petfinder.local",
    firstName: "Ola",
    lastName: "Kowalska",
    breedingName: "Brytyjska Chata",
    description: "Hodowla kotów brytyjskich krótkowłosych, FPL zarejestrowana.",
    street: "ul. Rynek 5",
    city: "Wrocław",
    postalCode: "50-106",
    latitude: 51.11,
    longitude: 17.03,
    breed: "British Shorthair",
    animals: [
      {
        name: "Whiskey",
        sex: "MALE",
        birthDate: "2024-05-10",
        description: "Spokojny kocurek o gęstej, pluszowej sierści.",
        price: 2800,
      },
      {
        name: "Bella",
        sex: "FEMALE",
        birthDate: "2024-05-10",
        description: "Towarzyska kotka, przyzwyczajona do dzieci i innych zwierząt.",
        price: 3000,
      },
    ],
  });

  await seedCatBreeder({
    email: "breeder-norwegian@petfinder.local",
    firstName: "Piotr",
    lastName: "Zieliński",
    breedingName: "Nordowe Trolle",
    description: "Hodowla norweskich kotów leśnych w typie naturalnym.",
    street: "ul. Legnicka 12",
    city: "Wrocław",
    postalCode: "54-203",
    latitude: 51.12,
    longitude: 16.98,
    breed: "Norweski Leśny",
    animals: [
      {
        name: "Thor",
        sex: "MALE",
        birthDate: "2024-06-01",
        description: "Duży, puszysty kocur, uwielbia wspinaczkę.",
        price: 3400,
      },
      {
        name: "Freya",
        sex: "FEMALE",
        birthDate: "2024-06-01",
        description: "Łagodna kotka z charakterystycznym podwójnym futerkiem.",
        price: 3200,
      },
    ],
  });

  await seedCatBreeder({
    email: "breeder-mainecoon@petfinder.local",
    firstName: "Magda",
    lastName: "Wiśniewska",
    breedingName: "Leśny Kocur",
    description: "Hodowla kotów maine coon z rodowodem.",
    street: "ul. Krupnicza 9",
    city: "Wrocław",
    postalCode: "50-075",
    latitude: 51.105,
    longitude: 17.025,
    breed: "Maine Coon",
    animals: [
      {
        name: "Simba",
        sex: "MALE",
        birthDate: "2024-04-20",
        description: "Majestatyczny kocur, jeden z największych w miocie.",
        price: 4500,
      },
      {
        name: "Nala",
        sex: "FEMALE",
        birthDate: "2024-04-20",
        description: "Łagodna, towarzyska kotka o charakterystycznych kępkach na uszach.",
        price: 4200,
      },
    ],
  });

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
