import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok" }, { status: 200 });
  } catch {
    return Response.json({ status: "error" }, { status: 503 });
  }
}
