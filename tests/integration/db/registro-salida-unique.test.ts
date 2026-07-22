import { describe, expect, test } from "vitest";
import { prisma } from "@/lib/db/client";

describe("unicidad de numeroPedido en RegistroSalida", () => {
  test("el segundo insert con el mismo numeroPedido falla por la restricción UNIQUE", async () => {
    const repartidor = await prisma.repartidor.findFirstOrThrow();
    const numeroPedido = 900_000 + Math.floor(Math.random() * 90_000);

    await prisma.registroSalida.create({
      data: { numeroPedido, repartidorId: repartidor.id, tarifaAplicada: 1000 },
    });

    await expect(
      prisma.registroSalida.create({
        data: { numeroPedido, repartidorId: repartidor.id, tarifaAplicada: 1000 },
      })
    ).rejects.toThrow();

    await prisma.registroSalida.deleteMany({ where: { numeroPedido } });
  });
});
