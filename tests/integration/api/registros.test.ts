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
});
