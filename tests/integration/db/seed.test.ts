import { describe, expect, test } from "vitest";
import { prisma } from "@/lib/db/client";

describe("seed de datos iniciales", () => {
  test("los 3 repartidores conocidos existen y están activos", async () => {
    const repartidores = await prisma.repartidor.findMany({
      where: { nombre: { in: ["Carlos", "Diego", "Andrés"] } },
    });

    expect(repartidores).toHaveLength(3);
    expect(repartidores.every((r) => r.activo)).toBe(true);
  });

  test("existe la fila de configuración con tarifa 1000", async () => {
    const config = await prisma.configuracionSistema.findUnique({ where: { id: "default" } });

    expect(config).not.toBeNull();
    expect(Number(config?.tarifaDomicilio)).toBe(1000);
  });
});
