import { obtenerResumen } from "@/lib/services/resumen";

export async function GET() {
  const resumen = await obtenerResumen();
  return Response.json(resumen);
}
