# Introduction

Este documento define la arquitectura fullstack completa de **Domicilios San Pedro** — backend, frontend, e integración entre ambos. Es la fuente única de verdad para el desarrollo dirigido por AI agents. Combina lo que tradicionalmente serían documentos separados de backend/frontend en uno unificado, dado que ambas capas están fuertemente entrelazadas en una app de este tamaño.

## Starter Template or Existing Project

**Decisión:** `create-next-app` (Next.js, App Router, TypeScript) como scaffold base + Prisma ORM agregado manualmente para Postgres.

**Razón:** App de 2 pantallas, sin necesidad de auth de usuarios externos ni tRPC — T3 Stack traería piezas sin uso (NextAuth). El scaffold oficial da control total, cero dependencias de un stack de terceros, setup mínimo para Story 1.1.

**Restricción que impone:** la estructura de proyecto sigue la convención de Next.js App Router (`app/` folder, route handlers como API).

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-07-22 | 0.1 | Borrador inicial del Architecture Document derivado del PRD | Winston (Architect) |
| 2026-07-22 | 0.2 | Ruta `/resumen/[repartidorId]` reemplazada por acordeón inline (`RepartidorAccordionRow`) tras validar mockups con el propietario — ver `docs/front-end-spec.md` | Sally (UX Expert) |
