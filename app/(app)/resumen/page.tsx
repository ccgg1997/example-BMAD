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
    <>
      <div>
        <h1 className="text-2xl leading-tight font-bold">Resumen de domicilios</h1>
        <p className="text-sm text-muted-foreground">Semana actual</p>
      </div>
      <TarifaVigenteCard tarifa={tarifaVigente} />
      <TotalesSemanaCard cantidad={totales.cantidad} valorAPagar={totales.valorAPagar} />
      <ResumenDomicilios resumen={resumen} />
    </>
  );
}
