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

  console.log("Seed complete: admin@petfinder.local / Admin123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
