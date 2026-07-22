# Domicilios San Pedro Fullstack Architecture Document

## Introduction

Este documento define la arquitectura fullstack completa de **Domicilios San Pedro** — backend, frontend, e integración entre ambos. Es la fuente única de verdad para el desarrollo dirigido por AI agents. Combina lo que tradicionalmente serían documentos separados de backend/frontend en uno unificado, dado que ambas capas están fuertemente entrelazadas en una app de este tamaño.

### Starter Template or Existing Project

**Decisión:** `create-next-app` (Next.js, App Router, TypeScript) como scaffold base + Prisma ORM agregado manualmente para Postgres.

**Razón:** App de 2 pantallas, sin necesidad de auth de usuarios externos ni tRPC — T3 Stack traería piezas sin uso (NextAuth). El scaffold oficial da control total, cero dependencias de un stack de terceros, setup mínimo para Story 1.1.

**Restricción que impone:** la estructura de proyecto sigue la convención de Next.js App Router (`app/` folder, route handlers como API).

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-07-22 | 0.1 | Borrador inicial del Architecture Document derivado del PRD | Winston (Architect) |

## High Level Architecture

### Technical Summary

Domicilios San Pedro se implementa como una aplicación monolítica full-stack sobre Next.js (App Router), donde el mismo proyecto sirve tanto la interfaz web responsive como los endpoints API (Route Handlers) consumidos por esa misma interfaz. Los datos se persisten en PostgreSQL, accedido mediante Prisma ORM, dentro de un contenedor Docker en un VPS de DigitalOcean, junto a Caddy como reverse proxy con HTTPS automático. No hay integraciones externas en el alcance del MVP: el sistema de caja (POS) permanece separado. Esta arquitectura simple y contenida cumple los objetivos del PRD — registro de salida sin fricción y resumen de domicilios en tiempo real — sin incurrir en la complejidad operativa de microservicios o múltiples proveedores.

### Platform and Infrastructure Choice

**Platform:** VPS propio en DigitalOcean (Droplet), desplegado vía Docker Compose.
**Key Services:** Droplet Ubuntu LTS (Docker Engine), contenedor Next.js (app + API), contenedor PostgreSQL, contenedor Caddy (reverse proxy + TLS automático vía Let's Encrypt).
**Deployment Host and Regions:** DigitalOcean, región NYC3 (baja latencia razonable hacia Colombia); una sola región es suficiente para el volumen de este MVP.

### Repository Structure

**Structure:** Repositorio único (single Next.js app) — no un monorepo multi-paquete clásico, ya que el App Router unifica frontend y API en el mismo proyecto. _Nota:_ esto ajusta la suposición inicial de "Monorepo" del PRD — aquí se simplifica a "un solo repo" porque no hay apps separadas (web/api) que orquestar.
**Monorepo Tool:** Ninguno por ahora. Se añadiría npm/pnpm workspaces solo si en el futuro aparece una segunda app (ej. una app móvil) que necesite compartir tipos vía un paquete `shared`.
**Package Organization:** Proyecto único con `app/` (rutas UI + route handlers API), `prisma/` (schema y migraciones), `lib/` (lógica de negocio: validación de duplicados, cálculo de resumen de domicilios).

### High Level Architecture Diagram

```mermaid
graph TD
    U["Repartidor / Propietario<br/>celular o tableta"] -->|HTTPS| C["Caddy<br/>reverse proxy + TLS"]
    C --> N["Next.js App<br/>UI + API Route Handlers"]
    N -->|Prisma ORM| P[("PostgreSQL")]
    subgraph VPS["VPS DigitalOcean - Docker Compose"]
        C
        N
        P
    end
```

### Architectural Patterns

- **Monolito Full-Stack (Next.js App Router):** UI y API en el mismo proyecto y despliegue. _Rationale:_ app de 2 pantallas y equipo de desarrollo pequeño — separar frontend/backend en servicios distintos agregaría complejidad operativa sin beneficio real.
- **Component-Based UI:** Componentes React (Server + Client Components) reutilizables. _Rationale:_ mantenibilidad y consistencia entre Registro de Salida y Resumen de Domicilios.
- **Repository Pattern (via Prisma):** Acceso a datos encapsulado en funciones/módulos de `lib/`, no queries dispersas. _Rationale:_ facilita testing (mockear la capa de datos) y una futura migración de base de datos si fuera necesaria.
- **BFF implícito (Route Handlers):** Los endpoints API de Next.js actúan como backend-for-frontend, único punto de entrada consumido por la UI. _Rationale:_ no se requiere API pública externa ni API Gateway separado para el MVP.
- **Despliegue Containerizado (Docker Compose):** App, base de datos y reverse proxy como contenedores orquestados juntos. _Rationale:_ reproducible entre entorno local y VPS, y portable si se cambia de proveedor más adelante.

## Tech Stack

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.x | Tipado estático en toda la UI | Consistencia con backend, menos bugs en refactors |
| Frontend Framework | Next.js (App Router) | 15.x | Framework React unificado (UI+API) | Decidido en Starter Template; SSR + Route Handlers en un solo proyecto |
| UI Component Library | shadcn/ui (sobre Radix + Tailwind) | latest | Componentes accesibles (botones, select, listas) | Sin branding definido (PRD); primitives accesibles listos, botones grandes acorde a UX Vision |
| State Management | React state (useState) + Server Components | React 19.x | Estado local de las 2 pantallas | App sin estado global complejo; datos se leen directo de la DB via Server Components, sin overhead de Redux/Zustand |
| Backend Language | TypeScript | 5.x | Misma base que frontend | Un solo lenguaje en todo el repo (Next.js Route Handlers) |
| Backend Framework | Next.js Route Handlers | 15.x | Endpoints API (`app/api/**`) | Ya incluido en el framework elegido; sin Express/Fastify separado |
| API Style | REST (JSON) | - | Comunicación UI ↔ Route Handlers | Más simple que GraphQL/tRPC para 3 pantallas y sin consumidores externos |
| Database | PostgreSQL | 16.x | Persistencia de repartidores y registros de salida | Relacional, encaja con FR8 (unicidad de número de pedido) y agregaciones del resumen |
| Cache | Ninguno | - | N/A para MVP | Volumen de uso (equipo <10 personas) no justifica capa de cache; revisar si crece |
| File Storage | Ninguno | - | N/A para MVP | Ningún requisito de PRD implica subir archivos/imágenes |
| Authentication | Password única compartida (cookie de sesión firmada) | - | Proteger acceso público a la app | Decisión de usuario: sin gestión de usuarios/roles, dispositivo compartido cerca de la salida |
| Frontend Testing | Vitest + React Testing Library | latest | Pruebas unitarias de componentes | Estándar actual para proyectos Next.js/TypeScript, rápido |
| Backend Testing | Vitest | latest | Pruebas unitarias/integración de lógica de negocio y Route Handlers | Mismo runner que frontend, un solo config |
| E2E Testing | No requerido para MVP | - | Ver Testing Strategy | PRD (Technical Assumptions) marca e2e como no requerido dado el tamaño del equipo; prueba manual guiada en su lugar |
| Build Tool | Next.js CLI | 15.x | Build/dev integrado | Incluido en el framework, sin configuración adicional |
| Bundler | Turbopack (dev) / Webpack (build prod) | integrado en Next 15 | Empaquetado de la app | Default de Next.js, sin necesidad de configurar Vite/esbuild aparte |
| IaC Tool | Docker Compose (como IaC ligero) | v2 | Definición reproducible de la infraestructura (app+db+proxy) | Un solo VPS; Terraform/Pulumi sería sobre-ingeniería para este alcance |
| CI/CD | GitHub Actions | - | Build + test + deploy automático al VPS | Gratuito para repos, se integra directo con el flujo de Docker Compose |
| Monitoring | Sentry (error tracking) + UptimeRobot (uptime ping) | free tier | Detectar errores y caídas del servicio | Bajo costo/cero costo, adecuado para un VPS autoadministrado sin equipo de SRE |
| Logging | Pino | latest | Logs estructurados JSON a stdout | Capturados por `docker compose logs`; suficiente sin stack ELK para este volumen |
| CSS Framework | Tailwind CSS | 4.x | Estilos utilitarios | Requerido por shadcn/ui; permite UI de botones grandes/simple sin CSS custom extenso |

## Data Models

### Repartidor

**Purpose:** Representa a cada repartidor que puede registrar salidas de pedidos (Carlos, Diego, Andrés, y futuros).

**Key Attributes:**
- id: string (cuid) - Identificador único
- nombre: string (único) - Nombre visible para selección en UI
- activo: boolean - Permite desactivar un repartidor sin borrar su historial

#### TypeScript Interface

```typescript
interface Repartidor {
  id: string;
  nombre: string;
  activo: boolean;
}
```

#### Relationships

- Un Repartidor tiene muchos RegistroSalida (1—N)

### RegistroSalida

**Purpose:** Representa un pedido registrado como "en salida" por un repartidor — el corazón del MVP (FR1-FR4, FR8).

**Key Attributes:**
- id: string (cuid) - Identificador único interno
- numeroPedido: number (único global) - Número de pedido escrito en la bolsa/POS; unicidad global implementa FR4 (no doble asignación) y FR8 (no se repite entre días)
- repartidorId: string (FK) - Repartidor que se lo llevó
- registradoEn: string (datetime ISO) - Fecha/hora del registro
- tarifaAplicada: number - Snapshot de la tarifa vigente al momento del registro (no se recalcula si la tarifa cambia después)

#### TypeScript Interface

```typescript
interface RegistroSalida {
  id: string;
  numeroPedido: number;
  repartidorId: string;
  registradoEn: string;
  tarifaAplicada: number;
}
```

#### Relationships

- Pertenece a un Repartidor (N—1)

### ConfiguracionSistema

**Purpose:** Fila única (singleton) que guarda la tarifa vigente por domicilio, configurable sin cambiar código (FR7).

**Key Attributes:**
- id: string (fijo, ej. "default") - Identificador singleton
- tarifaDomicilio: number - Valor actual en COP por domicilio (ej. 1000)

#### TypeScript Interface

```typescript
interface ConfiguracionSistema {
  id: string;
  tarifaDomicilio: number;
}
```

#### Relationships

- Leída por el flujo de Registro de Salida para fijar `tarifaAplicada` en cada nuevo registro

## API Specification

### REST API Specification

```yaml
openapi: 3.0.0
info:
  title: Domicilios San Pedro API
  version: 0.1.0
  description: API interna para registro de salidas y resumen de domicilios
servers:
  - url: https://dominio-droguria.com/api
    description: Producción (VPS DigitalOcean)

paths:
  /auth/login:
    post:
      summary: Autenticarse con la clave compartida
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                password: { type: string }
      responses:
        "200": { description: Cookie de sesión emitida }
        "401": { description: Password incorrecta }

  /auth/logout:
    post:
      summary: Cerrar sesión
      responses:
        "200": { description: Cookie de sesión invalidada }

  /repartidores:
    get:
      summary: Listar repartidores activos
      responses:
        "200":
          description: Lista de repartidores
          content:
            application/json:
              schema:
                type: array
                items: { $ref: "#/components/schemas/Repartidor" }

  /registros:
    post:
      summary: Registrar salida de uno o varios pedidos para un repartidor
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                repartidorId: { type: string }
                numerosPedido:
                  type: array
                  items: { type: integer }
      responses:
        "201":
          description: Registro(s) creado(s); incluye detalle de conflictos si algún número ya estaba asignado
          content:
            application/json:
              schema:
                type: object
                properties:
                  creados: { type: array, items: { $ref: "#/components/schemas/RegistroSalida" } }
                  conflictos:
                    type: array
                    items:
                      type: object
                      properties:
                        numeroPedido: { type: integer }
                        asignadoA: { type: string }

  /resumen:
    get:
      summary: Resumen de domicilios agregado por repartidor
      responses:
        "200":
          description: Cantidad y valor a pagar por repartidor
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    repartidor: { $ref: "#/components/schemas/Repartidor" }
                    cantidad: { type: integer }
                    valorAPagar: { type: number }

  /repartidores/{id}/pedidos:
    get:
      summary: Detalle de pedidos registrados a un repartidor
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        "200":
          description: Lista de registros del repartidor
          content:
            application/json:
              schema:
                type: array
                items: { $ref: "#/components/schemas/RegistroSalida" }

components:
  schemas:
    Repartidor:
      type: object
      properties:
        id: { type: string }
        nombre: { type: string }
        activo: { type: boolean }
    RegistroSalida:
      type: object
      properties:
        id: { type: string }
        numeroPedido: { type: integer }
        repartidorId: { type: string }
        registradoEn: { type: string, format: date-time }
        tarifaAplicada: { type: number }
```

## Components

### AuthGate (middleware.ts)

**Responsibility:** Verifica cookie de sesión en cada request; redirige a `/login` si falta o es inválida.

**Key Interfaces:**
- Next.js Middleware (`middleware.ts`)

**Dependencies:** `lib/auth.ts`

**Technology Stack:** Next.js Middleware, cookie firmada (iron-session o JWT)

### RegistroSalidaForm (Client Component)

**Responsibility:** UI para que el repartidor seleccione su nombre e ingrese uno o varios números de pedido.

**Key Interfaces:**
- `POST /api/registros`

**Dependencies:** `components/ui/*` (shadcn), `lib/api-client.ts`

**Technology Stack:** React Client Component, shadcn/ui, Tailwind

### ResumenDomicilios (Server Component)

**Responsibility:** Muestra la tabla de repartidores con cantidad de pedidos y valor a pagar.

**Key Interfaces:**
- Lectura directa vía `lib/db/registros.ts` (Server Component, sin round-trip HTTP)

**Dependencies:** `lib/db/registros.ts`

**Technology Stack:** React Server Component

### DetalleRepartidor (Server Component)

**Responsibility:** Lista los números de pedido registrados bajo un repartidor específico.

**Key Interfaces:**
- Ruta `/resumen/[repartidorId]`

**Dependencies:** `lib/db/registros.ts`

**Technology Stack:** React Server Component

### RegistroService (lib/services/registro.ts)

**Responsibility:** Valida duplicados (FR4/FR8) y crea registros de salida aplicando la tarifa vigente.

**Key Interfaces:**
- `crearRegistros(repartidorId, numerosPedido[]): { creados, conflictos }`

**Dependencies:** `lib/db/registros.ts`, `lib/tarifa.ts`

**Technology Stack:** TypeScript, Prisma

### ResumenService (lib/services/resumen.ts)

**Responsibility:** Agrega registros por repartidor y calcula el valor total a pagar.

**Key Interfaces:**
- `obtenerResumen(): ResumenPorRepartidor[]`

**Dependencies:** `lib/db/registros.ts`

**Technology Stack:** TypeScript, Prisma

### Component Diagrams

```mermaid
graph TD
    UI1[RegistroSalidaForm] -->|POST /api/registros| API1[Route Handler: registros]
    API1 --> SVC1[RegistroService]
    SVC1 --> DB1[(PostgreSQL via Prisma)]

    UI2[ResumenDomicilios] --> SVC2[ResumenService]
    UI3[DetalleRepartidor] --> SVC2
    SVC2 --> DB1

    MW[AuthGate Middleware] -.protege.-> UI1
    MW -.protege.-> UI2
    MW -.protege.-> UI3
```

## External APIs

N/A — el MVP no integra ninguna API externa. El sistema de caja (POS) permanece separado y sin integración (ver PRD, Additional Technical Assumptions). WhatsApp queda fuera de alcance explícitamente.

## Core Workflows

```mermaid
sequenceDiagram
    actor R as Repartidor
    participant UI as RegistroSalidaForm
    participant API as POST /api/registros
    participant SVC as RegistroService
    participant DB as PostgreSQL

    R->>UI: Selecciona nombre + ingresa números de pedido
    UI->>API: POST { repartidorId, numerosPedido[] }
    API->>SVC: crearRegistros(...)
    SVC->>DB: Verifica unicidad de cada numeroPedido
    alt número ya asignado
        DB-->>SVC: conflicto (repartidor existente)
        SVC-->>API: agrega a lista de conflictos, continúa con el resto
    else número libre
        SVC->>DB: INSERT registro_salida (con tarifaAplicada vigente)
        DB-->>SVC: registro creado
    end
    SVC-->>API: { creados, conflictos }
    API-->>UI: 201 con detalle
    UI-->>R: Confirmación + aviso de conflictos si los hay
```

```mermaid
sequenceDiagram
    actor P as Propietario
    participant UI as ResumenDomicilios
    participant SVC as ResumenService
    participant DB as PostgreSQL

    P->>UI: Abre /resumen
    UI->>SVC: obtenerResumen()
    SVC->>DB: SELECT agregando por repartidor
    DB-->>SVC: filas de registro_salida
    SVC-->>UI: [{repartidor, cantidad, valorAPagar}]
    UI-->>P: Tabla de resumen
```

## Database Schema

```sql
CREATE TABLE repartidor (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    nombre      TEXT NOT NULL UNIQUE,
    activo      BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE configuracion_sistema (
    id                TEXT PRIMARY KEY DEFAULT 'default',
    tarifa_domicilio  NUMERIC(10,2) NOT NULL DEFAULT 1000
);

CREATE TABLE registro_salida (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    numero_pedido    INTEGER NOT NULL UNIQUE,
    repartidor_id    TEXT NOT NULL REFERENCES repartidor(id),
    registrado_en    TIMESTAMPTZ NOT NULL DEFAULT now(),
    tarifa_aplicada  NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_registro_salida_repartidor ON registro_salida(repartidor_id);
CREATE INDEX idx_registro_salida_registrado_en ON registro_salida(registrado_en);
```

_Nota:_ la unicidad de `numero_pedido` a nivel de tabla implementa directamente FR4 (bloqueo de doble asignación) y FR8 (no repetir número entre días) con una sola restricción de base de datos.

## Frontend Architecture

### Component Organization

```text
app/
├── login/page.tsx
├── registro/page.tsx           # Home tras login — RegistroSalidaForm
├── resumen/page.tsx            # ResumenDomicilios
│   └── [repartidorId]/page.tsx # DetalleRepartidor
├── api/
│   ├── auth/login/route.ts
│   ├── auth/logout/route.ts
│   ├── repartidores/route.ts
│   ├── registros/route.ts
│   └── resumen/route.ts
└── layout.tsx

components/
├── ui/                          # primitives shadcn (button, select, input, table)
├── registro-salida-form.tsx
└── resumen-table.tsx
```

### Component Template

```typescript
interface RegistroSalidaFormProps {
  repartidores: Repartidor[];
}

export function RegistroSalidaForm({ repartidores }: RegistroSalidaFormProps) {
  // useState local: repartidorId seleccionado, lista de numerosPedido en edición
  // submit -> POST /api/registros vía lib/api-client.ts
  return null; // implementación en Story 1.3
}
```

### State Management Architecture

#### State Structure

```typescript
interface RegistroSalidaFormState {
  repartidorId: string | null;
  numerosPedido: number[];
  enviando: boolean;
  conflictos: { numeroPedido: number; asignadoA: string }[];
}
```

#### State Management Patterns

- Estado local con `useState` en cada Client Component — sin store global (Redux/Zustand no se justifican para 3 pantallas).
- Lecturas (resumen, listado de repartidores) vía Server Components, sin estado de cliente ni fetch manual.
- Única mutación de cliente relevante es el formulario de registro; su estado vive y muere con el componente.

### Routing Architecture

#### Route Organization

```text
/login              - Login (password única)
/registro           - Registro de Salida (home tras login)
/resumen            - Resumen de Domicilios
/resumen/[id]        - Detalle de pedidos por repartidor
```

#### Protected Route Pattern

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  if (!session && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
```

### Frontend Services Layer

#### API Client Setup

```typescript
// lib/api-client.ts
async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

#### Service Example

```typescript
// lib/services/registro-client.ts
export function registrarSalida(repartidorId: string, numerosPedido: number[]) {
  return apiPost<{ creados: RegistroSalida[]; conflictos: unknown[] }>(
    "/registros",
    { repartidorId, numerosPedido }
  );
}
```

## Backend Architecture

### Service Architecture

**Traditional server** (contenedor Node persistente corriendo Next.js, no funciones serverless individuales) — coherente con el despliegue en VPS/Docker Compose elegido.

#### Controller/Route Organization

```text
app/api/
├── auth/login/route.ts
├── auth/logout/route.ts
├── repartidores/route.ts
├── registros/route.ts
└── resumen/route.ts
```

#### Controller Template

```typescript
// app/api/registros/route.ts
export async function POST(request: Request) {
  const body = registrosSchema.parse(await request.json()); // validación zod
  const resultado = await crearRegistros(body.repartidorId, body.numerosPedido);
  return Response.json(resultado, { status: 201 });
}
```

### Database Architecture

#### Schema Design

Ver sección **Database Schema** arriba (fuente única del esquema).

#### Data Access Layer

```typescript
// lib/db/registros.ts
export async function crearRegistros(repartidorId: string, numeros: number[]) {
  const tarifa = await obtenerTarifaVigente();
  const creados = [];
  const conflictos = [];
  for (const numeroPedido of numeros) {
    try {
      creados.push(
        await prisma.registroSalida.create({
          data: { repartidorId, numeroPedido, tarifaAplicada: tarifa },
        })
      );
    } catch (e) {
      const existente = await prisma.registroSalida.findUnique({ where: { numeroPedido } });
      conflictos.push({ numeroPedido, asignadoA: existente?.repartidorId });
    }
  }
  return { creados, conflictos };
}
```

### Authentication and Authorization

#### Auth Flow

```mermaid
sequenceDiagram
    actor U as Usuario (repartidor/propietario)
    participant UI as /login
    participant API as POST /api/auth/login
    participant ENV as APP_PASSWORD (env var)

    U->>UI: Ingresa password
    UI->>API: POST { password }
    API->>ENV: Compara contra APP_PASSWORD
    alt correcta
        API-->>UI: Set-Cookie session (httpOnly, secure, firmada)
        UI-->>U: Redirige a /registro
    else incorrecta
        API-->>UI: 401
        UI-->>U: "Password incorrecta"
    end
```

#### Middleware/Guards

```typescript
// lib/auth.ts
export function verificarSesion(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  return verificarFirma(cookieValue, process.env.SESSION_SECRET!);
}
```

## Unified Project Structure

```text
domicilios-san-pedro/
├── .github/
│   └── workflows/
│       ├── ci.yaml              # test + lint en cada push/PR
│       └── deploy.yaml          # build + deploy al VPS en push a main
├── app/
│   ├── login/page.tsx
│   ├── registro/page.tsx
│   ├── resumen/
│   │   ├── page.tsx
│   │   └── [repartidorId]/page.tsx
│   ├── api/
│   │   ├── auth/login/route.ts
│   │   ├── auth/logout/route.ts
│   │   ├── repartidores/route.ts
│   │   ├── registros/route.ts
│   │   ├── resumen/route.ts
│   │   └── health/route.ts
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── registro-salida-form.tsx
│   └── resumen-table.tsx
├── lib/
│   ├── db/
│   │   ├── client.ts
│   │   └── registros.ts
│   ├── services/
│   │   ├── registro.ts
│   │   └── resumen.ts
│   ├── auth.ts
│   ├── tarifa.ts
│   └── config.ts               # única puerta de entrada a process.env
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
│   ├── unit/
│   └── integration/
├── middleware.ts
├── docker-compose.yml
├── Dockerfile
├── Caddyfile
├── docs/
│   ├── brief.md
│   ├── prd.md
│   └── architecture.md
├── .env.example
├── package.json
└── README.md
```

## Development Workflow

### Local Development Setup

#### Prerequisites

```bash
node --version   # >= 20
docker --version
docker compose version
```

#### Initial Setup

```bash
git clone <repo>
cd domicilios-san-pedro
cp .env.example .env
npm install
docker compose up -d db
npx prisma migrate dev
```

#### Development Commands

```bash
# Start all services (app + db vía Docker Compose)
docker compose up -d

# Modo desarrollo local (fuera de Docker, apuntando a db en Docker)
npm run dev

# Run tests
npm run test
```

### Environment Configuration

#### Required Environment Variables

```bash
# App (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/domicilios
APP_PASSWORD=clave-compartida-del-negocio
SESSION_SECRET=una-cadena-aleatoria-larga
SENTRY_DSN=                       # opcional
```

## Deployment Architecture

### Deployment Strategy

**Frontend Deployment:**
- **Platform:** Mismo contenedor que el backend (Next.js standalone output) — no hay CDN/edge separado.
- **Build Command:** `next build` (dentro del Dockerfile)
- **Output Directory:** `.next/standalone`
- **CDN/Edge:** Ninguno — Caddy sirve estáticos directamente; volumen de tráfico no lo justifica.

**Backend Deployment:**
- **Platform:** VPS DigitalOcean, contenedor Docker (Route Handlers dentro del mismo proceso Next.js)
- **Build Command:** `docker compose build`
- **Deployment Method:** GitHub Actions → SSH al VPS → `docker compose pull && docker compose up -d`

### CI/CD Pipeline

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /srv/domicilios-san-pedro
            git pull
            docker compose up -d --build
```

### Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|-------------|-------------|---------|
| Development | localhost:3000 | localhost:3000/api | Desarrollo local |
| Production | dominio-droguria.com | dominio-droguria.com/api | Entorno en vivo, único ambiente dado el tamaño del proyecto |

_Nota:_ no se define ambiente de Staging separado — el volumen y equipo de este MVP no lo justifica; los cambios se validan localmente y con prueba manual guiada antes de cada deploy a producción.

## Security and Performance

### Security Requirements

**Frontend Security:**
- CSP Headers: política básica restringiendo `script-src 'self'`
- XSS Prevention: escape automático de React + validación de que `numeroPedido` sea siempre numérico
- Secure Storage: cookie de sesión `httpOnly`, `secure`, `sameSite=strict` — nunca en localStorage

**Backend Security:**
- Input Validation: todo Route Handler valida el body con `zod` antes de tocar la base de datos
- Rate Limiting: límite estricto de intentos en `/api/auth/login` (ej. 5/min por IP) dado que es una password única compartida
- CORS Policy: mismo origen únicamente — no hay consumidores API externos

**Authentication Security:**
- Token Storage: cookie de sesión firmada (HMAC con `SESSION_SECRET`)
- Session Management: expiración larga (ej. 30 días) acorde a uso en dispositivo compartido cerca de la salida
- Password Policy: password única definida en variable de entorno, rotable manualmente por el propietario cuando lo considere necesario

### Performance Optimization

**Frontend Performance:**
- Bundle Size Target: mantenerse liviano dado que son 3 pantallas simples (shadcn/ui + Tailwind, sin librerías pesadas)
- Loading Strategy: Server Components para reducir JS enviado al cliente en resumen/detalle
- Caching Strategy: ninguna capa de cache explícita — el volumen de uso no lo requiere en el MVP

**Backend Performance:**
- Response Time Target: <300ms en `/api/registros` y `/api/resumen` bajo el volumen esperado (decenas de registros/día)
- Database Optimization: índices en `numero_pedido` (unique) y `repartidor_id` (ver Database Schema)
- Caching Strategy: ninguna — revisar solo si el volumen crece significativamente

## Testing Strategy

### Testing Pyramid

```text
E2E Tests (ninguno para MVP)
        /            \
  Integration Tests (Route Handlers)
      /                    \
Frontend Unit          Backend Unit
(componentes)      (RegistroService, ResumenService)
```

### Test Organization

#### Frontend Tests

```text
tests/unit/components/registro-salida-form.test.tsx
tests/unit/components/resumen-table.test.tsx
```

#### Backend Tests

```text
tests/unit/services/registro.test.ts
tests/integration/api/registros.test.ts
tests/integration/api/resumen.test.ts
```

#### E2E Tests

No aplica para el MVP (ver PRD Technical Assumptions) — se recomienda prueba manual guiada del flujo completo antes de cada entrega al propietario.

### Test Examples

#### Frontend Component Test

```typescript
test("no permite enviar sin seleccionar repartidor", () => {
  render(<RegistroSalidaForm repartidores={mockRepartidores} />);
  expect(screen.getByRole("button", { name: /registrar salida/i })).toBeDisabled();
});
```

#### Backend API Test

```typescript
test("rechaza numeroPedido ya asignado a otro repartidor", async () => {
  await crearRegistros("repartidor-1", [183]);
  const resultado = await crearRegistros("repartidor-2", [183]);
  expect(resultado.conflictos).toContainEqual(
    expect.objectContaining({ numeroPedido: 183, asignadoA: "repartidor-1" })
  );
});
```

## Coding Standards

### Critical Fullstack Rules

- **Sin acceso directo a Prisma desde Client Components:** las consultas a base de datos solo ocurren en Server Components, Route Handlers o `lib/services/*` — nunca en código que corra en el navegador.
- **Variables de entorno centralizadas:** acceder solo vía `lib/config.ts`, nunca `process.env` disperso por el código.
- **Validación en el borde:** todo Route Handler valida su body con `zod` antes de llamar a un service.
- **Tarifa como snapshot:** `tarifaAplicada` se guarda en cada `RegistroSalida` al crearlo; nunca se recalcula retroactivamente si `configuracion_sistema.tarifa_domicilio` cambia después.
- **Unicidad como única fuente de verdad de conflicto:** la validación de doble asignación (FR4) se apoya en la restricción `UNIQUE` de `numero_pedido`, no en lógica aplicativa duplicada.
- **Nunca loguear el password de la app** ni el `SESSION_SECRET`, ni en Sentry ni en logs de Pino.

### Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `RegistroSalidaForm.tsx` |
| Hooks | camelCase con 'use' | - | `useRegistroForm.ts` |
| API Routes | - | kebab-case | `/api/repartidores` |
| Database Tables | - | snake_case | `registro_salida` |

## Error Handling Strategy

### Error Flow

```mermaid
sequenceDiagram
    participant UI
    participant API as Route Handler
    participant SVC as Service

    UI->>API: request
    API->>SVC: llamada
    SVC-->>API: throw AppError
    API-->>UI: 4xx/5xx { error: ApiError }
    UI-->>UI: muestra mensaje al usuario (toast)
```

### Error Response Format

```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}
```

### Frontend Error Handling

```typescript
try {
  await registrarSalida(repartidorId, numerosPedido);
} catch (e) {
  toast.error("No se pudo registrar la salida. Intenta de nuevo.");
}
```

### Backend Error Handling

```typescript
export async function POST(request: Request) {
  try {
    const body = registrosSchema.parse(await request.json());
    return Response.json(await crearRegistros(body.repartidorId, body.numerosPedido), { status: 201 });
  } catch (e) {
    return Response.json(
      { error: { code: "BAD_REQUEST", message: String(e), timestamp: new Date().toISOString(), requestId: crypto.randomUUID() } },
      { status: 400 }
    );
  }
}
```

## Monitoring and Observability

### Monitoring Stack

- **Frontend Monitoring:** Sentry (captura de errores JS en cliente)
- **Backend Monitoring:** Sentry (captura de errores en Route Handlers)
- **Error Tracking:** Sentry (free tier), unificado frontend+backend
- **Performance Monitoring:** UptimeRobot haciendo ping a `/api/health` cada 5 min

### Key Metrics

**Frontend Metrics:**
- Core Web Vitals
- Errores de JavaScript
- Tiempos de respuesta de `/api/registros` y `/api/resumen`
- Interacciones de usuario (registro completado vs. abandonado)

**Backend Metrics:**
- Tasa de requests
- Tasa de error (4xx/5xx)
- Tiempo de respuesta
- Conflictos de duplicado detectados (métrica de negocio: valida que FR4 esté funcionando)

## Checklist Results Report

_Ejecutado: `architect-checklist.md` en modo comprehensive, contra `docs/architecture.md` y `docs/prd.md`. Proyecto tipo Full-Stack (con UI) — secciones [[FRONTEND ONLY]] evaluadas._

### Executive Summary

- **Architecture Readiness:** **Medium** — base sólida, patrones claros y muy apta para implementación por AI agents, pero con 2-3 vacíos de severidad alta que deben cerrarse antes de desarrollo (no requieren rediseño, son adiciones puntuales).
- **Riesgos críticos:** sin estrategia de backup de PostgreSQL; NFR3 (conectividad intermitente) sin solución técnica; seguridad de infraestructura del VPS (firewall/puertos) no especificada.
- **Fortalezas clave:** unicidad de `numero_pedido` resuelve FR4+FR8 con una sola restricción de DB (elegante, reduce superficie de error); componentes pequeños y con responsabilidad única, muy alineados al sizing "2-4h" de las historias del PRD; diagramas completos (arquitectura, componentes, 2 flujos secuenciales, auth, error).
- **Tipo de proyecto:** Full-Stack, documento único (sin frontend-architecture.md separado — correcto para este alcance).

### Section Analysis (pass rate aproximado)

| Sección | Pass rate | Nota |
|---|---|---|
| 1. Requirements Alignment | ~80% | FR7 (tarifa configurable) sin endpoint/UI de edición; edge cases parcialmente cubiertos |
| 2. Architecture Fundamentals | ~95% | Diagramas y separación de capas sólidos |
| 3. Technical Stack & Decisions | ~75% | Varias versiones como "latest" en vez de fijas; sin plan de seed ni backup |
| 4. Frontend Design & Implementation | ~85% | Falta explicitar code-splitting/lazy loading (bajo impacto a esta escala) |
| 5. Resilience & Operational Readiness | ~55% | Mayor concentración de gaps: retry, backups, rollback, sizing |
| 6. Security & Compliance | ~70% | Falta firewall/puertos del VPS, encriptación en reposo, comparación segura de password |
| 7. Implementation Guidance | ~80% | Falta testing de seguridad; resto sólido |
| 8. Dependency & Integration Mgmt | ~70% | Sin estrategia de actualización/patching de dependencias |
| 9. AI Agent Implementation Suitability | ~95% | Punto más fuerte del documento |
| 10. Accessibility [[FRONTEND ONLY]] | N/A por decisión de producto | PRD fija Accessibility: None explícitamente |

### Risk Assessment (top 5)

1. **Sin estrategia de backup de PostgreSQL (Alta).** Al elegir VPS propio en vez de un Postgres gestionado (Neon/Supabase), se pierde el backup automático. Un fallo del droplet borra todo el historial de domicilios y pagos. _Mitigación:_ `pg_dump` diario vía cron dentro del contenedor + copia a almacenamiento externo (ej. DigitalOcean Spaces o descarga a otro servidor). Agregar como parte de Story 1.1 o nueva story de infraestructura.
2. **NFR3 (conectividad intermitente) sin solución técnica (Alta).** El PRD pide tolerar conexión inestable; el diseño actual no define reintentos en el cliente ni manejo de envío duplicado. Un repartidor con mala señal puede creer que registró su salida y no haberlo hecho. _Mitigación:_ reintento automático con backoff en `lib/api-client.ts` + idempotencia (reenviar el mismo `numeroPedido` no debe crear duplicado, ya lo protege el unique constraint, así que reintentar es seguro).
3. **Seguridad de infraestructura del VPS no especificada (Alta-Media).** No se documentó firewall (DigitalOcean Cloud Firewall/UFW), ni que el puerto de PostgreSQL no debe exponerse públicamente. _Mitigación:_ Postgres solo accesible dentro de la red interna de Docker Compose (sin `ports:` mapeado al host); firewall del Droplet permitiendo solo 80/443/22.
4. **Versiones "latest" en el Tech Stack (Media).** shadcn/ui, Vitest, Sentry, Pino quedaron sin versión fija — riesgo de builds no reproducibles. _Mitigación:_ fijar versión exacta al hacer `npm install` inicial y congelarla en `package.json`.
5. **Sin estrategia de rollback ni tamaño de Droplet recomendado (Media).** Si un deploy rompe producción no hay procedimiento de reversión documentado, y no se sugirió un tamaño de VPS de partida. _Mitigación:_ mantener la imagen anterior taggeada en el pipeline de deploy para poder revertir; Droplet recomendado de partida: 1vCPU/1GB (Basic), suficiente para este volumen.

### Recommendations

**Must-fix antes de desarrollo:**
- Definir y documentar backup automatizado de PostgreSQL.
- Agregar reintento/idempotencia en el cliente para cubrir NFR3.
- Especificar firewall del VPS y que Postgres no se expone fuera de la red Docker interna.

**Should-fix para mejor calidad:**
- Fijar versiones exactas de shadcn/ui, Vitest, Sentry, Pino.
- Agregar endpoint/UI mínima para editar `tarifaDomicilio` (hoy FR7 solo tiene el modelo de datos, no la interfaz de edición).
- Agregar script de seed para los repartidores iniciales (Carlos, Diego, Andrés).
- Documentar procedimiento de rollback de despliegue y tamaño de Droplet recomendado.

**Nice-to-have:**
- Umbrales concretos de alerta en Sentry/UptimeRobot (ej. "alertar si tasa de error >5%").
- Rate limiting también en `/api/registros` (no solo login).
- Registro formal de decisiones (ADR) más allá del rationale inline.

### AI Implementation Readiness

Documento muy apto para implementación por AI agents: componentes pequeños de responsabilidad única, patrones repetidos y predecibles (service + repository + route handler), y la validación de duplicados resuelta con una sola restricción de base de datos en vez de lógica dispersa — reduce directamente la probabilidad de que un agente introduzca un bug de concurrencia. Único punto de atención: los 3 must-fix de la sección de Riesgos deberían convertirse en tareas explícitas (idealmente dentro de Story 1.1 de infraestructura) antes de que un agente empiece a implementar, para que no se construyan "por defecto" sin backup ni reintentos.
