import { CircleDollarSign, Package, Tag } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { RepartidorAccordionRow } from "@/components/repartidor-accordion-row";
import type { ResumenPorRepartidor } from "@/lib/services/resumen";

export function formatearPesos(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function TarifaVigenteCard({ tarifa }: { tarifa: number }) {
  return (
    <Card className="flex flex-row items-center gap-3 bg-accent p-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
        <Tag className="size-5" />
      </span>
      <div>
        <p className="text-sm text-muted-foreground">Tarifa vigente</p>
        <p className="text-xl font-bold">
          {formatearPesos(tarifa)} <span className="text-sm font-normal">por domicilio</span>
        </p>
      </div>
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
    <Card className="flex flex-row items-center justify-around gap-4 p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
          <Package className="size-5" />
        </span>
        <div>
          <p className="text-xl font-bold text-primary">{cantidad}</p>
          <p className="text-xs text-muted-foreground">pedidos esta semana</p>
        </div>
      </div>
      <div className="h-10 w-px bg-border" />
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
          <CircleDollarSign className="size-5" />
        </span>
        <div>
          <p className="text-xl font-bold text-primary">{formatearPesos(valorAPagar)}</p>
          <p className="text-xs text-muted-foreground">por pagar</p>
        </div>
      </div>
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
            activo={fila.repartidor.activo}
            cantidad={fila.cantidad}
            valorAPagar={fila.valorAPagar}
            pedidos={fila.pedidos}
          />
        ))}
      </Accordion>
    </Card>
  );
}
