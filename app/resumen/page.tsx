import { obtenerResumen } from "@/lib/services/resumen";
import { obtenerTarifaVigente } from "@/lib/tarifa";
import {
  ResumenDomicilios,
  TarifaVigenteCard,
  TotalesSemanaCard,
} from "@/components/resumen-table";

// Mismo motivo que app/registro/page.tsx: sin esto, Next.js prerenderiza el
// resumen una sola vez en build time y nunca refleja domicilios nuevos.
export const dynamic = "force-dynamic";

export default async function ResumenPage() {
  const [resumen, tarifaVigente] = await Promise.all([obtenerResumen(), obtenerTarifaVigente()]);

  const totales = resumen.reduce(
    (acumulado, fila) => ({
      cantidad: acumulado.cantidad + fila.cantidad,
      valorAPagar: acumulado.valorAPagar + fila.valorAPagar,
    }),
    { cantidad: 0, valorAPagar: 0 }
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">Resumen de Domicilios</h1>
      <TarifaVigenteCard tarifa={tarifaVigente} />
      <TotalesSemanaCard cantidad={totales.cantidad} valorAPagar={totales.valorAPagar} />
      <ResumenDomicilios resumen={resumen} />
    </main>
  );
}
