import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResumenDomicilios, TotalesSemanaCard } from "@/components/resumen-table";
import type { ResumenPorRepartidor } from "@/lib/services/resumen";

const mockResumen: ResumenPorRepartidor[] = [
  { repartidor: { id: "1", nombre: "Carlos", activo: true }, cantidad: 3, valorAPagar: 3000 },
  { repartidor: { id: "2", nombre: "Diego", activo: true }, cantidad: 5, valorAPagar: 5000 },
];

describe("ResumenDomicilios", () => {
  test("muestra nombre, cantidad y valor de cada repartidor", () => {
    render(<ResumenDomicilios resumen={mockResumen} />);

    expect(screen.getByText("Carlos")).toBeInTheDocument();
    expect(screen.getByText("Diego")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});

describe("TotalesSemanaCard", () => {
  test("suma correctamente cantidad y valor de todos los repartidores", () => {
    const totales = mockResumen.reduce(
      (acumulado, fila) => ({
        cantidad: acumulado.cantidad + fila.cantidad,
        valorAPagar: acumulado.valorAPagar + fila.valorAPagar,
      }),
      { cantidad: 0, valorAPagar: 0 }
    );

    render(<TotalesSemanaCard cantidad={totales.cantidad} valorAPagar={totales.valorAPagar} />);

    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText(/8[.,]?000/)).toBeInTheDocument();
  });
});
