import { describe, expect, test } from "vitest";
import { POST as login } from "@/app/api/auth/login/route";

function loginRequest(password: string, ip: string) {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({ password }),
  });
}

describe("POST /api/auth/login", () => {
  test("clave correcta responde 200 y emite cookie de sesión", async () => {
    const response = await login(loginRequest(process.env.APP_PASSWORD!, "test-ip-correct"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(response.headers.get("set-cookie")).toMatch(/^session=/);
  });

  test("clave incorrecta responde 401 y no emite cookie", async () => {
    const response = await login(loginRequest("clave-incorrecta", "test-ip-incorrect"));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBeTruthy();
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  test("bloquea tras superar el límite de intentos por IP", async () => {
    const ip = "test-ip-ratelimit";
    for (let i = 0; i < 5; i++) {
      await login(loginRequest("clave-incorrecta", ip));
    }
    const response = await login(loginRequest("clave-incorrecta", ip));

    expect(response.status).toBe(429);
  });
});
