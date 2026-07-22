# Data Models

## Repartidor

**Purpose:** Representa a cada repartidor que puede registrar salidas de pedidos (Carlos, Diego, Andrés, y futuros).

**Key Attributes:**
- id: string (cuid) - Identificador único
- nombre: string (único) - Nombre visible para selección en UI
- activo: boolean - Permite desactivar un repartidor sin borrar su historial

### TypeScript Interface

```typescript
interface Repartidor {
  id: string;
  nombre: string;
  activo: boolean;
}
```

### Relationships

- Un Repartidor tiene muchos RegistroSalida (1—N)

## RegistroSalida

**Purpose:** Representa un pedido registrado como "en salida" por un repartidor — el corazón del MVP (FR1-FR4, FR8).

**Key Attributes:**
- id: string (cuid) - Identificador único interno
- numeroPedido: number (único global) - Número de pedido escrito en la bolsa/POS; unicidad global implementa FR4 (no doble asignación) y FR8 (no se repite entre días)
- repartidorId: string (FK) - Repartidor que se lo llevó
- registradoEn: string (datetime ISO) - Fecha/hora del registro
- tarifaAplicada: number - Snapshot de la tarifa vigente al momento del registro (no se recalcula si la tarifa cambia después)

### TypeScript Interface

```typescript
interface RegistroSalida {
  id: string;
  numeroPedido: number;
  repartidorId: string;
  registradoEn: string;
  tarifaAplicada: number;
}
```

### Relationships

- Pertenece a un Repartidor (N—1)

## ConfiguracionSistema

**Purpose:** Fila única (singleton) que guarda la tarifa vigente por domicilio, configurable sin cambiar código (FR7).

**Key Attributes:**
- id: string (fijo, ej. "default") - Identificador singleton
- tarifaDomicilio: number - Valor actual en COP por domicilio (ej. 1000)

### TypeScript Interface

```typescript
interface ConfiguracionSistema {
  id: string;
  tarifaDomicilio: number;
}
```

### Relationships

- Leída por el flujo de Registro de Salida para fijar `tarifaAplicada` en cada nuevo registro
