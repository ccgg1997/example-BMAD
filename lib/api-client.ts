function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// NFR3: la conexión en el punto de venta es intermitente. Reintenta con backoff
// ante fallas de red o del servidor (5xx); un 4xx no se reintenta porque es un
// error permanente de la solicitud, no algo que un reintento vaya a arreglar.
export async function apiPost<T>(url: string, body: unknown, intentosMaximos = 3): Promise<T> {
  for (let intento = 1; intento <= intentosMaximos; intento++) {
    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      if (intento === intentosMaximos) throw error;
      await esperar(2 ** intento * 300);
      continue;
    }

    if (response.ok) {
      return (await response.json()) as T;
    }

    if (response.status < 500) {
      const cuerpo = await response.json().catch(() => null);
      throw new Error(cuerpo?.error ?? `Solicitud rechazada (${response.status})`);
    }

    if (intento === intentosMaximos) {
      throw new Error(`Error del servidor (${response.status})`);
    }
    await esperar(2 ** intento * 300);
  }

  throw new Error("No se pudo completar la solicitud.");
}
