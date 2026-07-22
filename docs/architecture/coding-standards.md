# Coding Standards

## Critical Fullstack Rules

- **Sin acceso directo a Prisma desde Client Components:** las consultas a base de datos solo ocurren en Server Components, Route Handlers o `lib/services/*` — nunca en código que corra en el navegador.
- **Variables de entorno centralizadas:** acceder solo vía `lib/config.ts`, nunca `process.env` disperso por el código.
- **Validación en el borde:** todo Route Handler valida su body con `zod` antes de llamar a un service.
- **Tarifa como snapshot:** `tarifaAplicada` se guarda en cada `RegistroSalida` al crearlo; nunca se recalcula retroactivamente si `configuracion_sistema.tarifa_domicilio` cambia después.
- **Unicidad como única fuente de verdad de conflicto:** la validación de doble asignación (FR4) se apoya en la restricción `UNIQUE` de `numero_pedido`, no en lógica aplicativa duplicada.
- **Nunca loguear el password de la app** ni el `SESSION_SECRET`, ni en Sentry ni en logs de Pino.

## Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `RegistroSalidaForm.tsx` |
| Hooks | camelCase con 'use' | - | `useRegistroForm.ts` |
| API Routes | - | kebab-case | `/api/repartidores` |
| Database Tables | - | snake_case | `registro_salida` |
