import { apiPost } from "@/lib/api-client";
import type { Conflicto } from "@/lib/db/registros";

interface RegistroSalidaCreado {
  id: string;
  numeroPedido: number;
  repartidorId: string;
  registradoEn: string;
  tarifaAplicada: string;
}

interface RegistrarSalidaResultado {
  creados: RegistroSalidaCreado[];
  conflictos: Conflicto[];
}

export function registrarSalida(repartidorId: string, numerosPedido: number[]) {
  return apiPost<RegistrarSalidaResultado>("/api/registros", { repartidorId, numerosPedido });
}
