const LIMITE_INTENTOS = 5;
const VENTANA_MS = 60_000;

const intentosPorIp = new Map<string, number[]>();

export function superaLimite(ip: string): boolean {
  const ahora = Date.now();
  const historial = (intentosPorIp.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  intentosPorIp.set(ip, historial);
  return historial.length >= LIMITE_INTENTOS;
}

export function registrarIntento(ip: string): void {
  const historial = intentosPorIp.get(ip) ?? [];
  historial.push(Date.now());
  intentosPorIp.set(ip, historial);
}
