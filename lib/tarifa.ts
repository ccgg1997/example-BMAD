import { prisma } from "@/lib/db/client";

export async function obtenerTarifaVigente(): Promise<number> {
  const config = await prisma.configuracionSistema.findUniqueOrThrow({ where: { id: "default" } });
  return Number(config.tarifaDomicilio);
}
