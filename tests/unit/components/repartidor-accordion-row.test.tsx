import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "@/components/ui/accordion";
import { RepartidorAccordionRow } from "@/components/repartidor-accordion-row";

describe("RepartidorAccordionRow", () => {
  test("al expandir, muestra los pedidos de ese repartidor y no los de otro", async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="multiple">
        <RepartidorAccordionRow
          repartidorId="1"
          nombre="Carlos"
          cantidad={1}
          valorAPagar={1000}
          pedidos={[{ numeroPedido: 111, registradoEn: "2026-07-20T10:00:00.000Z" }]}
        />
        <RepartidorAccordionRow
          repartidorId="2"
          nombre="Diego"
          cantidad={1}
          valorAPagar={1000}
          pedidos={[{ numeroPedido: 222, registradoEn: "2026-07-20T11:00:00.000Z" }]}
        />
      </Accordion>
    );

    await user.click(screen.getByRole("button", { name: /carlos/i }));

    expect(screen.getByText("Pedido 111")).toBeInTheDocument();
    expect(screen.queryByText("Pedido 222")).not.toBeInTheDocument();
  });
});
