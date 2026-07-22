# Domicilios San Pedro

Aplicación web de seguimiento de domicilios para Droguería San Pedro. Permite a los repartidores registrar qué pedidos llevan al salir (bloqueando doble asignación) y al propietario ver un resumen por repartidor de cuántos domicilios hizo y cuánto se le debe.

Planeado con BMad Method — ver `docs/prd.md` y `docs/architecture.md` para el detalle funcional y técnico.

## Stack

Next.js 15 (App Router) + TypeScript, PostgreSQL vía Prisma, Tailwind CSS + shadcn/ui, Vitest.

## Desarrollo local

```bash
cp .env.example .env
npm install
docker compose up -d db
npx prisma migrate dev

npm run dev      # servidor de desarrollo (Turbopack)
npm run test     # Vitest
docker compose up -d   # app + db completos en Docker
```

Variables de entorno requeridas: `DATABASE_URL`, `APP_PASSWORD`, `SESSION_SECRET`, `SENTRY_DSN` (opcional).
