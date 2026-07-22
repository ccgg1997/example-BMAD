# Frontend Architecture

## Component Organization

```text
app/
├── login/page.tsx
├── registro/page.tsx           # Home tras login — RegistroSalidaForm
├── resumen/page.tsx            # ResumenDomicilios (incluye acordeón inline por repartidor)
├── api/
│   ├── auth/login/route.ts
│   ├── auth/logout/route.ts
│   ├── repartidores/route.ts
│   ├── registros/route.ts
│   └── resumen/route.ts
└── layout.tsx

components/
├── ui/                          # primitives shadcn (button, select, input, table, accordion)
├── registro-salida-form.tsx
├── resumen-table.tsx
└── repartidor-accordion-row.tsx # fila expandible con detalle de pedidos (ex DetalleRepartidor)
```

> _Actualizado tras validación de mockups (`docs/front-end-spec.md`):_ el detalle por repartidor NO es una ruta separada — es un acordeón expandible dentro de la misma pantalla `/resumen`. Se elimina `resumen/[repartidorId]/page.tsx`.

## Component Template

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

## State Management Architecture

### State Structure

```typescript
interface RegistroSalidaFormState {
  repartidorId: string | null;
  numerosPedido: number[];
  enviando: boolean;
  conflictos: { numeroPedido: number; asignadoA: string }[];
}
```

### State Management Patterns

- Estado local con `useState` en cada Client Component — sin store global (Redux/Zustand no se justifican para 3 pantallas).
- Lecturas (resumen, listado de repartidores) vía Server Components, sin estado de cliente ni fetch manual.
- Única mutación de cliente relevante es el formulario de registro; su estado vive y muere con el componente.

## Routing Architecture

### Route Organization

```text
/login              - Login (password única)
/registro           - Registro de Salida (home tras login)
/resumen            - Resumen de Domicilios (incluye detalle por repartidor como acordeón inline, sin ruta propia)
```

### Protected Route Pattern

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

## Frontend Services Layer

### API Client Setup

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

### Service Example

```typescript
// lib/services/registro-client.ts
export function registrarSalida(repartidorId: string, numerosPedido: number[]) {
  return apiPost<{ creados: RegistroSalida[]; conflictos: unknown[] }>(
    "/registros",
    { repartidorId, numerosPedido }
  );
}
```
