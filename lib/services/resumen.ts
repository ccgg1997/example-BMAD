import { prisma } from "@/lib/db/client";

export interface PedidoResumen {
  numeroPedido: number;
  registradoEn: string;
}

export interface ResumenPorRepartidor {
  repartidor: { id: string; nombre: string; activo: boolean };
  cantidad: number;
  valorAPagar: number;
  pedidos: PedidoResumen[];
}

// AC1 menciona "período vigente (ej. la semana en curso)" a modo de ejemplo,
// pero no existe en el modelo de datos ningún corte/reset semanal (Story 1.3
// no lo define, ninguna otra historia lo requiere) — se implementa como
// acumulado histórico total, que es lo que describen literalmente las Tasks
// de esta historia y el JSON de referencia de la API.
//
// Story 2.3 (Task 1) extiende esta consulta para incluir también el detalle
// de pedidos (numeroPedido + registradoEn) por repartidor, no solo el
// agregado — por eso ya no alcanza con groupBy (Story 2.1): se trae cada
// registro completo y se agrega en memoria, aceptable al volumen del MVP
// ("decenas de registros/día", sin capa de caché).
export async function obtenerResumen(): Promise<ResumenPorRepartidor[]> {
  const repartidores = await prisma.repartidor.findMany({
    orderBy: { nombre: "asc" },
    include: {
      registros: {
        select: { numeroPedido: true, registradoEn: true, tarifaAplicada: true },
        orderBy: { registradoEn: "asc" },
      },
    },
  });

  return repartidores.map((repartidor) => {
    const cantidad = repartidor.registros.length;
    const valorAPagar = repartidor.registros.reduce(
      (total, registro) => total + Number(registro.tarifaAplicada),
      0
    );
    const pedidos: PedidoResumen[] = repartidor.registros.map((registro) => ({
      numeroPedido: registro.numeroPedido,
      registradoEn: registro.registradoEn.toISOString(),
    }));

    return {
      repartidor: { id: repartidor.id, nombre: repartidor.nombre, activo: repartidor.activo },
      cantidad,
      valorAPagar,
      pedidos,
    };
  });
}
