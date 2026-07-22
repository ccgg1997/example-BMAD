import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verificarSesion } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const sesionValida = await verificarSesion(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (!sesionValida) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|api/auth|api/health|_next/static|_next/image|favicon.ico).*)"],
};
