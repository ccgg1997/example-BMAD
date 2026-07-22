import * as z from "zod";
import { crearRegistros } from "@/lib/db/registros";

const registrosSchema = z.object({
  repartidorId: z.string().min(1),
  numerosPedido: z.array(z.number().int().positive()).min(1),
});

export async function POST(request: Request) {
  const parsed = registrosSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const resultado = await crearRegistros(parsed.data.repartidorId, parsed.data.numerosPedido);
  return Response.json(resultado, { status: 201 });
}
