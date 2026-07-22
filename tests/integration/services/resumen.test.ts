import { afterEach, describe, expect, test } from "vitest";
import { prisma } from "@/lib/db/client";
import { obtenerResumen } from "@/lib/services/resumen";

const numerosCreados: number[] = [];

afterEach(async () => {
  if (numerosCreados.length > 0) {
    await prisma.registroSalida.deleteMany({ where: { numeroPedido: { in: numerosCreados } } });
    numerosCreados.length = 0;
  }
});

async function crearRegistroDirecto(repartidorId: string, tarifaAplicada: number) {
  const numeroPedido = 830_000 + Math.floor(Math.random() * 9_000) + numerosCreados.length;
  numerosCreados.push(numeroPedido);
  return prisma.registroSalida.create({ data: { repartidorId, numeroPedido, tarifaAplicada } });
}

describe("obtenerResumen", () => {
  test("cuenta y suma tarifaAplicada por repartidor", async () => {
    const repartidor = await prisma.repartidor.findFirstOrThrow();
    await crearRegistroDirecto(repartidor.id, 1000);
    await crearRegistroDirecto(repartidor.id, 1000);
    await crearRegistroDirecto(repartidor.id, 1000);

    const resumen = await obtenerResumen();
    const fila = resumen.find((r) => r.repartidor.id === repartidor.id);

    expect(fila).toBeDefined();
    expect(fila!.cantidad).toBeGreaterThanOrEqual(3);
    expect(fila!.valorAPagar).toBeGreaterThanOrEqual(3000);
  });

  test("usa tarifaAplicada (snapshot) de cada registro, no la tarifa vigente actual", async () => {
    // No se muta `configuracionSistema` (singleton compartido: otros archivos de
    // test corren en paralelo y leen la tarifa vigente). En su lugar, se crean
    // registros con `tarifaAplicada` explícitas distintas entre sí y se verifica
    // que la suma usa exactamente esos valores guardados, no un recálculo.
    const repartidor = await prisma.repartidor.findFirstOrThrow();
    const antes = await obtenerResumen();
    const valorAntes = antes.find((r) => r.repartidor.id === repartidor.id)?.valorAPagar ?? 0;

    await crearRegistroDirecto(repartidor.id, 1000);
    await crearRegistroDirecto(repartidor.id, 5000);

    const despues = await obtenerResumen();
    const valorDespues = despues.find((r) => r.repartidor.id === repartidor.id)!.valorAPagar;

    expect(valorDespues - valorAntes).toBe(6000);
  });
});
