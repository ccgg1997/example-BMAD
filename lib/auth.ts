import { config } from "@/lib/config";

// Web Crypto (`crypto.subtle`), no `node:crypto` — este módulo lo importa
// `middleware.ts`, que corre en Edge Runtime y no soporta módulos nativos de Node.
export const SESSION_COOKIE_NAME = "session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días

const encoder = new TextEncoder();

async function claveHmac(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(config.sessionSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferAHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexABuffer(hex: string): Uint8Array<ArrayBuffer> | null {
  if (hex.length % 2 !== 0 || !/^[0-9a-f]*$/i.test(hex)) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export async function crearCookieSesion(): Promise<string> {
  const payload = Date.now().toString();
  const clave = await claveHmac();
  const firma = await crypto.subtle.sign("HMAC", clave, encoder.encode(payload));
  return `${payload}.${bufferAHex(firma)}`;
}

export async function verificarSesion(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;

  const [payload, firmaHex] = cookieValue.split(".");
  if (!payload || !firmaHex) return false;

  const firmaBytes = hexABuffer(firmaHex);
  if (!firmaBytes) return false;

  const clave = await claveHmac();
  const valida = await crypto.subtle.verify("HMAC", clave, firmaBytes, encoder.encode(payload));
  if (!valida) return false;

  const emitidoEn = Number(payload);
  if (!Number.isFinite(emitidoEn)) return false;
  return Date.now() - emitidoEn < SESSION_MAX_AGE_SECONDS * 1000;
}

export function construirCookieHeader(value: string, maxAgeSeconds: number): string {
  const secure = config.isProduction ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${value}; HttpOnly${secure}; SameSite=Strict; Path=/; Max-Age=${maxAgeSeconds}`;
}
