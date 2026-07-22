import { describe, expect, test } from "vitest";
import { POST as crearRegistros } from "@/app/api/registros/route";
import { prisma } from "@/lib/db/client";
import { obtenerTarifaVigente } from "@/lib/tarifa";

function registrosRequest(repartidorId: string, numerosPedido: number[]) {
  return new Request("http://localhost/api/registros", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ repartidorId, numerosPedido }),
  });
}

describe("POST /api/registros", () => {
  test("crea registros con tarifaAplicada igual a la tarifa vigente", async () => {
    const repartidor = await prisma.repartidor.findFirstOrThrow();
    const tarifaVigente = await obtenerTarifaVigente();
    const numeroPedido = 800_000 + Math.floor(Math.random() * 90_000);

    const response = await crearRegistros(registrosRequest(repartidor.id, [numeroPedido]));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.creados).toHaveLength(1);
    expect(Number(body.creados[0].tarifaAplicada)).toBe(tarifaVigente);
    expect(body.conflictos).toHaveLength(0);

    await prisma.registroSalida.deleteMany({ where: { numeroPedido } });
  });

  test("rechaza un numeroPedido ya asignado a otro repartidor, reportando a quién", async () => {
    const repartidores = await prisma.repartidor.findMany({ take: 2 });
    if (repartidores.length < 2) throw new Error("Se necesitan al menos 2 repartidores seedeados");
    const [repartidor1, repartidor2] = repartidores;
    const numeroPedido = 810_000 + Math.floor(Math.random() * 9_000);

    await crearRegistros(registrosRequest(repartidor1.id, [numeroPedido]));
    const response = await crearRegistros(registrosRequest(repartidor2.id, [numeroPedido]));
    const body = await response.json();

    expect(body.creados).toHaveLength(0);
    expect(body.conflictos).toContainEqual(
      expect.objectContaining({ numeroPedido, asignadoA: repartidor1.id })
    );

    await prisma.registroSalida.deleteMany({ where: { numeroPedido } });
  });

  test("un conflicto en el lote no bloquea los demás números válidos", async () => {
    const repartidor1 = await prisma.repartidor.findFirstOrThrow();
    const base = 820_000 + Math.floor(Math.random() * 9_000);
    const [numeroDuplicado, numeroValido1, numeroValido2] = [base, base + 1, base + 2];

    await crearRegistros(registrosRequest(repartidor1.id, [numeroDuplicado]));

    const response = await crearRegistros(
      registrosRequest(repartidor1.id, [numeroDuplicado, numeroValido1, numeroValido2])
    );
    const body = await response.json();

    expect(body.creados).toHaveLength(2);
    expect(body.creados.map((r: { numeroPedido: number }) => r.numeroPedido).sort()).toEqual(
      [numeroValido1, numeroValido2].sort()
    );
    expect(body.conflictos).toContainEqual(
      expect.objectContaining({ numeroPedido: numeroDuplicado })
    );

    await prisma.registroSalida.deleteMany({
      where: { numeroPedido: { in: [numeroDuplicado, numeroValido1, numeroValido2] } },
    });
  });
});
