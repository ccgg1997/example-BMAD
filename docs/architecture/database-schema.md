# Database Schema

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
