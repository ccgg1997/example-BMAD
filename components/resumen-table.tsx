import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RepartidorAccordionRow } from "@/components/repartidor-accordion-row";
import type { ResumenPorRepartidor } from "@/lib/services/resumen";

function formatearPesos(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function TarifaVigenteCard({ tarifa }: { tarifa: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">Tarifa vigente</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{formatearPesos(tarifa)}</p>
        <p className="text-sm text-muted-foreground">por domicilio</p>
      </CardContent>
    </Card>
  );
}

export function TotalesSemanaCard({
  cantidad,
  valorAPagar,
}: {
  cantidad: number;
  valorAPagar: number;
}) {
  return (
    <Card>
      <CardContent className="flex justify-between gap-4 pt-6">
        <div>
          <p className="text-2xl font-semibold">{cantidad}</p>
          <p className="text-sm text-muted-foreground">pedidos esta semana</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">{formatearPesos(valorAPagar)}</p>
          <p className="text-sm text-muted-foreground">por pagar</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface ResumenDomiciliosProps {
  resumen: ResumenPorRepartidor[];
}

export function ResumenDomicilios({ resumen }: ResumenDomiciliosProps) {
  return (
    <Card className="px-4">
      {/* type="multiple": varios repartidores pueden quedar expandidos a la
          vez — no hay respuesta del propietario sobre si debe ser exclusivo,
          así que se implementa el comportamiento más simple (Story 2.3). */}
      <Accordion type="multiple">
        {resumen.map((fila) => (
          <RepartidorAccordionRow
            key={fila.repartidor.id}
            repartidorId={fila.repartidor.id}
            nombre={fila.repartidor.nombre}
            cantidad={fila.cantidad}
            valorAPagar={fila.valorAPagar}
            pedidos={fila.pedidos}
          />
        ))}
      </Accordion>
    </Card>
  );
}
