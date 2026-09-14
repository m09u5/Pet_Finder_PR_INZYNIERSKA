import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

describe("GET /api/health", () => {
  it("returns 200 and confirms the database connection is alive", async () => {
    const app = createApp();
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});

describe("unknown route", () => {
  it("returns 404 with a JSON error payload", async () => {
    const app = createApp();
    const response = await request(app).get("/api/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("ROUTE_NOT_FOUND");
  });
});
