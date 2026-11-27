import { prisma } from "../../config/prisma";
import type { HealthRepository } from "../health.repository";

export class PrismaHealthRepository implements HealthRepository {
  async ping() {
    await prisma.$queryRaw`SELECT 1`;
  }
}
