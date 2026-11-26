import { Prisma } from "@prisma/client";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";
import { toAppError } from "../src/utils/toAppError";

const app = createApp();

function prismaError(code: string) {
  return new Prisma.PrismaClientKnownRequestError("database error", { code, clientVersion: "test" });
}

describe("error handling", () => {
  it("returns 400 for malformed JSON", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send('{"email":');

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_JSON");
  });

  it("returns 413 for a request body over the limit", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "a".repeat(200 * 1024) });

    expect(response.status).toBe(413);
    expect(response.body.error.code).toBe("PAYLOAD_TOO_LARGE");
  });

  it("returns 404 for an unknown route", async () => {
    const response = await request(app).get("/api/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("ROUTE_NOT_FOUND");
  });

  it("maps database errors to client status codes", () => {
    expect(toAppError(prismaError("P2002"))?.statusCode).toBe(409);
    expect(toAppError(prismaError("P2003"))?.statusCode).toBe(409);
    expect(toAppError(prismaError("P2025"))?.statusCode).toBe(404);
    expect(toAppError(prismaError("P1001"))).toBeNull();
  });

  it("leaves unknown errors unmapped so they end as 500", () => {
    expect(toAppError(new Error("boom"))).toBeNull();
  });
});
