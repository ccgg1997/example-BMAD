import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Repartidor</TableHead>
            <TableHead className="text-right">Pedidos</TableHead>
            <TableHead className="text-right">Valor a pagar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumen.map((fila) => (
            <TableRow key={fila.repartidor.id}>
              <TableCell>{fila.repartidor.nombre}</TableCell>
              <TableCell className="text-right">{fila.cantidad}</TableCell>
              <TableCell className="text-right">{formatearPesos(fila.valorAPagar)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
