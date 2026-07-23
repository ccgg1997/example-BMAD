import { afterEach, describe, expect, test } from "vitest";
import { prisma } from "@/lib/db/client";
import { obtenerResumen } from "@/lib/services/resumen";

const numerosCreados: number[] = [];

// Base random en [830000, 839999] — rango propio de este archivo, disjunto del
// de los otros tests de integración (registros ≤ 829999, unique ≥ 900000).
// El contador es monotónico y NO se reinicia entre tests, así cada numeroPedido
// es único durante toda la corrida del archivo (el `random + length` anterior sí
// se reiniciaba en afterEach y podía colisionar con el random del test siguiente).
const numeroBase = 830_000 + Math.floor(Math.random() * 10_000);
let contadorNumero = 0;

afterEach(async () => {
  if (numerosCreados.length > 0) {
    await prisma.registroSalida.deleteMany({ where: { numeroPedido: { in: numerosCreados } } });
    numerosCreados.length = 0;
  }
});

async function crearRegistroDirecto(repartidorId: string, tarifaAplicada: number) {
  const numeroPedido = numeroBase + contadorNumero;
  contadorNumero += 1;
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
    // No se muta `configuracionSistema` (fila singleton compartida por toda la
    // app). En su lugar, se crean registros con `tarifaAplicada` explícitas
    // distintas entre sí y se verifica que la suma usa exactamente esos valores
    // guardados, no un recálculo con la tarifa vigente. Se mide como diff contra
    // un baseline para no depender de que el repartidor arranque en 0.
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
