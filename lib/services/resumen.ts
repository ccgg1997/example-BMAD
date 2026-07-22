import { prisma } from "@/lib/db/client";

export interface ResumenPorRepartidor {
  repartidor: { id: string; nombre: string; activo: boolean };
  cantidad: number;
  valorAPagar: number;
}

// AC1 menciona "período vigente (ej. la semana en curso)" a modo de ejemplo,
// pero no existe en el modelo de datos ningún corte/reset semanal (Story 1.3
// no lo define, ninguna otra historia lo requiere) — se implementa como
// acumulado histórico total, que es lo que describen literalmente las Tasks
// de esta historia y el JSON de referencia de la API.
export async function obtenerResumen(): Promise<ResumenPorRepartidor[]> {
  const repartidores = await prisma.repartidor.findMany({ orderBy: { nombre: "asc" } });

  const agregados = await prisma.registroSalida.groupBy({
    by: ["repartidorId"],
    _count: { _all: true },
    _sum: { tarifaAplicada: true },
  });

  const agregadoPorRepartidor = new Map(
    agregados.map((agregado) => [
      agregado.repartidorId,
      {
        cantidad: agregado._count._all,
        valorAPagar: Number(agregado._sum.tarifaAplicada ?? 0),
      },
    ])
  );

  return repartidores.map((repartidor) => ({
    repartidor: { id: repartidor.id, nombre: repartidor.nombre, activo: repartidor.activo },
    ...(agregadoPorRepartidor.get(repartidor.id) ?? { cantidad: 0, valorAPagar: 0 }),
  }));
}
