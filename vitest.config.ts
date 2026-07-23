import "dotenv/config";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    // Los tests de integración comparten UNA sola Postgres real (no una DB por
    // worker) y varios archivos operan sobre el mismo repartidor (todos usan
    // `findFirstOrThrow()`), creando y borrando registros. Con el paralelismo
    // por archivo de vitest, un archivo mutaba el total de un repartidor
    // mientras otro lo medía → falla no determinística en CI (`resumen.test.ts`
    // veía diff=5000 en vez de 6000 porque `registros.test.ts` borró su
    // registro de 1000 a mitad de la medición). Serializar los archivos elimina
    // toda interferencia cruzada sobre las filas compartidas.
    fileParallelism: false,
  },
});
