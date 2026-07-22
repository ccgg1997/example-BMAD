import { prisma } from "@/lib/db/client";
import { obtenerTarifaVigente } from "@/lib/tarifa";

export interface Conflicto {
  numeroPedido: number;
  asignadoA: string | null;
}

export async function crearRegistros(repartidorId: string, numerosPedido: number[]) {
  const tarifa = await obtenerTarifaVigente();
  const creados = [];
  const conflictos: Conflicto[] = [];

  for (const numeroPedido of numerosPedido) {
    try {
      creados.push(
        await prisma.registroSalida.create({
          data: { repartidorId, numeroPedido, tarifaAplicada: tarifa },
        })
      );
    } catch {
      const existente = await prisma.registroSalida.findUnique({ where: { numeroPedido } });
      conflictos.push({ numeroPedido, asignadoA: existente?.repartidorId ?? null });
    }
  }

  return { creados, conflictos };
}
