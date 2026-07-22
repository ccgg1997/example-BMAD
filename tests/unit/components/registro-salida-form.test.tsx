import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { RegistroSalidaForm } from "@/components/registro-salida-form";

const mockRepartidores = [
  { id: "1", nombre: "Carlos" },
  { id: "2", nombre: "Diego" },
];

describe("RegistroSalidaForm", () => {
  test("no permite enviar sin seleccionar repartidor", () => {
    render(<RegistroSalidaForm repartidores={mockRepartidores} />);
    expect(screen.getByRole("button", { name: /registrar salida/i })).toBeDisabled();
  });
});
