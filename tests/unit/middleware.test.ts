import { NextRequest } from "next/server";
import { describe, expect, test } from "vitest";
import { middleware } from "@/middleware";
import { crearCookieSesion } from "@/lib/auth";

describe("middleware de sesión", () => {
  test("ruta protegida sin sesión redirige a /login", async () => {
    const request = new NextRequest("http://localhost/resumen");
    const response = await middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/login");
  });

  test("ruta protegida con sesión válida deja pasar", async () => {
    const cookie = await crearCookieSesion();
    const request = new NextRequest("http://localhost/resumen", {
      headers: { cookie: `session=${cookie}` },
    });
    const response = await middleware(request);

    expect(response.headers.get("location")).toBeNull();
  });
});
