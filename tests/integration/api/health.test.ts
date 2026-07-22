import { describe, expect, test } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  test("responde 200 cuando la base de datos está disponible", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: "ok" });
  });
});
