"use client";

import { Eye, Package, User } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatearPesos } from "@/components/resumen-table";
import type { PedidoResumen } from "@/lib/services/resumen";

function formatearFechaHora(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface RepartidorAccordionRowProps {
  repartidorId: string;
  nombre: string;
  activo: boolean;
  cantidad: number;
  valorAPagar: number;
  pedidos: PedidoResumen[];
}

export function RepartidorAccordionRow({
  repartidorId,
  nombre,
  activo,
  cantidad,
  valorAPagar,
  pedidos,
}: RepartidorAccordionRowProps) {
  return (
    <AccordionItem value={repartidorId}>
      <AccordionTrigger>
        <div className="flex flex-1 items-center gap-3">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
              activo ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            <User className="size-5" />
          </span>
          <span className="flex-1 text-left font-semibold">{nombre}</span>
        </div>
        <div className="flex items-center gap-4 pl-2">
          <div className="text-right">
            <p className="font-bold text-primary">{cantidad}</p>
            <p className="text-xs text-muted-foreground">pedidos</p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="font-bold text-primary">{formatearPesos(valorAPagar)}</p>
            <p className="text-xs text-muted-foreground">a pagar</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-primary">
            <Eye className="size-3.5" />
            Ver
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Pedidos de {nombre}
        </p>
        {pedidos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin pedidos registrados.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {pedidos.map((pedido) => (
              <li
                key={pedido.numeroPedido}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <Package className="size-4 shrink-0 text-primary" />
                <span className="flex-1">Pedido {pedido.numeroPedido}</span>
                <span className="text-muted-foreground">{formatearFechaHora(pedido.registradoEn)}</span>
              </li>
            ))}
          </ul>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
