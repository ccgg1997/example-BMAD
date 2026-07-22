"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [confirmado, setConfirmado] = useState(false);
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

  async function handleSubmit() {
    if (!repartidorId || numerosPedido.length === 0) return;

    setEnviando(true);
    setError(null);
    setConflictos([]);
    setConfirmado(false);

    try {
      const resultado = await registrarSalida(repartidorId, numerosPedido);
      setConflictos(resultado.conflictos);
      if (resultado.creados.length > 0) {
        setConfirmado(true);
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
      <Select value={repartidorId ?? undefined} onValueChange={setRepartidorId}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona tu nombre" />
        </SelectTrigger>
        <SelectContent>
          {repartidores.map((repartidor) => (
            <SelectItem key={repartidor.id} value={repartidor.id}>
              {repartidor.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Input
          inputMode="numeric"
          placeholder="Número de pedido"
          value={numeroActual}
          onChange={(event) => setNumeroActual(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              agregarNumero();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={agregarNumero}>
          Agregar
        </Button>
      </div>

      {numerosPedido.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {numerosPedido.map((numero) => (
            <li
              key={numero}
              className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
            >
              {numero}
              <button
                type="button"
                aria-label={`Quitar pedido ${numero}`}
                onClick={() => quitarNumero(numero)}
                className="text-muted-foreground"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {conflictos.length > 0 && (
        <ul className="flex flex-col gap-1">
          {conflictos.map((conflicto) => (
            <li key={conflicto.numeroPedido} className="text-sm text-destructive">
              Pedido {conflicto.numeroPedido} ya está asignado a{" "}
              {nombrePorId(repartidores, conflicto.asignadoA)}.
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {confirmado && <p className="text-sm text-primary">Registrado.</p>}

      <Button
        type="button"
        size="lg"
        disabled={!repartidorId || numerosPedido.length === 0 || enviando}
        onClick={handleSubmit}
      >
        {enviando ? "Registrando..." : "Registrar salida"}
      </Button>
    </div>
  );
}
