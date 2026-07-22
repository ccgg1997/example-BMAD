function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta variable de entorno: ${name}`);
  }
  return value;
}

// Getters, no propiedades planas: Next.js importa este módulo al recolectar
// datos de las rutas durante el build de la imagen Docker, donde los secrets
// reales todavía no existen (se inyectan recién al arrancar el contenedor).
// Con getters, `required()` solo corre cuando algo *usa* el valor en tiempo
// de request, no cuando el módulo se carga.
export const config = {
  get appPassword() {
    return required("APP_PASSWORD");
  },
  get sessionSecret() {
    return required("SESSION_SECRET");
  },
  sentryDsn: process.env.SENTRY_DSN || undefined,
  isProduction: process.env.NODE_ENV === "production",
};
