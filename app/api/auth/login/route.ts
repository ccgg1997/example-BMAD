import * as z from "zod";
import { config } from "@/lib/config";
import { SESSION_MAX_AGE_SECONDS, construirCookieHeader, crearCookieSesion } from "@/lib/auth";
import { registrarIntento, superaLimite } from "@/lib/rate-limit";

const loginSchema = z.object({ password: z.string().min(1) });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  if (superaLimite(ip)) {
    return Response.json(
      { error: "Demasiados intentos. Espera un minuto e intenta de nuevo." },
      { status: 429 }
    );
  }
  registrarIntento(ip);

  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (parsed.data.password !== config.appPassword) {
    return Response.json({ error: "Clave incorrecta." }, { status: 401 });
  }

  const response = Response.json({ ok: true }, { status: 200 });
  response.headers.append(
    "Set-Cookie",
    construirCookieHeader(await crearCookieSesion(), SESSION_MAX_AGE_SECONDS)
  );
  return response;
}
