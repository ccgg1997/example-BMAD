import { prisma } from "@/lib/db/client";

export async function GET() {
  const repartidores = await prisma.repartidor.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });

  return Response.json(repartidores);
}
