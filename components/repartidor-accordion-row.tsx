"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { PedidoResumen } from "@/lib/services/resumen";

function formatearPesos(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

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
  cantidad: number;
  valorAPagar: number;
  pedidos: PedidoResumen[];
}

export function RepartidorAccordionRow({
  repartidorId,
  nombre,
  cantidad,
  valorAPagar,
  pedidos,
}: RepartidorAccordionRowProps) {
  return (
    <AccordionItem value={repartidorId}>
      <AccordionTrigger>
        <span className="flex flex-1 items-center justify-between gap-4 pr-2">
          <span>{nombre}</span>
          <span className="flex gap-4 text-sm text-muted-foreground">
            <span>{cantidad} pedidos</span>
            <span>{formatearPesos(valorAPagar)}</span>
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        {pedidos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin pedidos registrados.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {pedidos.map((pedido) => (
              <li
                key={pedido.numeroPedido}
                className="flex justify-between text-sm text-muted-foreground"
              >
                <span>Pedido {pedido.numeroPedido}</span>
                <span>{formatearFechaHora(pedido.registradoEn)}</span>
              </li>
            ))}
          </ul>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
