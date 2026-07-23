import { prisma } from "@/lib/db/client";

// Opcional (Story 2.3, Task 4): el acordeón de /resumen NO usa este endpoint
// — consume los datos que ya trajo el Server Component padre, sin round-trip
// HTTP. Se documenta/implementa por si se necesita consumo externo futuro.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const registros = await prisma.registroSalida.findMany({
    where: { repartidorId: id },
    orderBy: { registradoEn: "asc" },
  });

  return Response.json(registros);
}
