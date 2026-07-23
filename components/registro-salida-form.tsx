"use client";

import { useState } from "react";
import { ChevronRight, Info, Package, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RepartidorCard } from "@/components/repartidor-card";
import { StatusBanner } from "@/components/status-banner";
import { registrarSalida } from "@/lib/services/registro-client";
import type { Conflicto } from "@/lib/db/registros";

interface Repartidor {
  id: string;
  nombre: string;
}

interface RegistroSalidaFormProps {
  repartidores: Repartidor[];
}

function nombrePorId(repartidores: Repartidor[], id: string | null): string {
  if (!id) return "otro repartidor";
  return repartidores.find((repartidor) => repartidor.id === id)?.nombre ?? "otro repartidor";
}

export function RegistroSalidaForm({ repartidores }: RegistroSalidaFormProps) {
  const [repartidorId, setRepartidorId] = useState<string | null>(null);
  const [numeroActual, setNumeroActual] = useState("");
  const [numerosPedido, setNumerosPedido] = useState<number[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [conflictos, setConflictos] = useState<Conflicto[]>([]);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function agregarNumero() {
    const numero = Number(numeroActual);
    if (!Number.isInteger(numero) || numero <= 0) return;
    if (numerosPedido.includes(numero)) return;
    setNumerosPedido((actual) => [...actual, numero]);
    setNumeroActual("");
  }

  function quitarNumero(numero: number) {
    setNumerosPedido((actual) => actual.filter((n) => n !== numero));
  }

  function quitarConflicto(numeroPedido: number) {
    setConflictos((actual) => actual.filter((c) => c.numeroPedido !== numeroPedido));
  }

  async function handleSubmit() {
    if (!repartidorId || numerosPedido.length === 0) return;

    setEnviando(true);
    setError(null);
    setConflictos([]);
    setMensajeExito(null);

    try {
      const resultado = await registrarSalida(repartidorId, numerosPedido);
      setConflictos(resultado.conflictos);
      if (resultado.creados.length > 0) {
        const n = resultado.creados.length;
        setMensajeExito(
          `${n} pedido${n === 1 ? "" : "s"} registrado${n === 1 ? "" : "s"}. ` +
            resultado.creados.map((r) => r.numeroPedido).join(", ") +
            (n === 1 ? " registrado correctamente." : " registrados correctamente.")
        );
        setNumerosPedido([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la salida.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-3 rounded-xl border p-4">
        <h2 className="text-sm font-semibold">Selecciona repartidor</h2>
        <div className="flex gap-2">
          {repartidores.map((repartidor) => (
            <RepartidorCard
              key={repartidor.id}
              nombre={repartidor.nombre}
              selected={repartidor.id === repartidorId}
              onSelect={() => setRepartidorId(repartidor.id)}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border p-4">
        <h2 className="text-sm font-semibold">Números de pedido</h2>
        <div className="flex gap-2">
          <Input
            inputMode="numeric"
            placeholder="Ingresa número de pedido"
            value={numeroActual}
            onChange={(event) => setNumeroActual(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                agregarNumero();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={agregarNumero}>
            Agregar
          </Button>
        </div>

        {numerosPedido.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {numerosPedido.map((numero) => (
              <li
                key={numero}
                className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
              >
                {numero}
                <button
                  type="button"
                  aria-label={`Quitar pedido ${numero}`}
                  onClick={() => quitarNumero(numero)}
                  className="opacity-70 hover:opacity-100"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Info className="size-3.5 shrink-0" />
          Puedes registrar varios pedidos en una sola salida.
        </p>
      </section>

      {numerosPedido.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl bg-accent px-4 py-3 text-sm font-medium text-primary">
          <Package className="size-5 shrink-0" />
          <span className="flex-1">
            {numerosPedido.length} pedido{numerosPedido.length === 1 ? "" : "s"} listo
            {numerosPedido.length === 1 ? "" : "s"} para registrar
          </span>
          <ChevronRight className="size-4 shrink-0" />
        </div>
      )}

      <Button
        type="button"
        size="lg"
        className="gap-2"
        disabled={!repartidorId || numerosPedido.length === 0 || enviando}
        onClick={handleSubmit}
      >
        <Send className="size-4" />
        {enviando ? "Registrando..." : "Registrar salida"}
      </Button>

      {conflictos.map((conflicto) => (
        <StatusBanner
          key={conflicto.numeroPedido}
          variant="error"
          onDismiss={() => quitarConflicto(conflicto.numeroPedido)}
        >
          Pedido {conflicto.numeroPedido} ya está asignado a{" "}
          {nombrePorId(repartidores, conflicto.asignadoA)}.
        </StatusBanner>
      ))}

      {error && (
        <StatusBanner variant="error" onDismiss={() => setError(null)}>
          {error}
        </StatusBanner>
      )}

      {mensajeExito && (
        <StatusBanner variant="success" onDismiss={() => setMensajeExito(null)}>
          {mensajeExito}
        </StatusBanner>
      )}
    </div>
  );
}
