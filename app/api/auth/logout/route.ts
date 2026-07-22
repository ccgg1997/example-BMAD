import { construirCookieHeader } from "@/lib/auth";

export async function POST() {
  const response = Response.json({ ok: true }, { status: 200 });
  response.headers.append("Set-Cookie", construirCookieHeader("", 0));
  return response;
}
