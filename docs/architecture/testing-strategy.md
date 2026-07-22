# Testing Strategy

## Testing Pyramid

```text
E2E Tests (ninguno para MVP)
        /            \
  Integration Tests (Route Handlers)
      /                    \
Frontend Unit          Backend Unit
(componentes)      (RegistroService, ResumenService)
```

## Test Organization

### Frontend Tests

```text
tests/unit/components/registro-salida-form.test.tsx
tests/unit/components/resumen-table.test.tsx
```

### Backend Tests

```text
tests/unit/services/registro.test.ts
tests/integration/api/registros.test.ts
tests/integration/api/resumen.test.ts
```

### E2E Tests

No aplica para el MVP (ver PRD Technical Assumptions) — se recomienda prueba manual guiada del flujo completo antes de cada entrega al propietario.

## Test Examples

### Frontend Component Test

```typescript
test("no permite enviar sin seleccionar repartidor", () => {
  render(<RegistroSalidaForm repartidores={mockRepartidores} />);
  expect(screen.getByRole("button", { name: /registrar salida/i })).toBeDisabled();
});
```

### Backend API Test

```typescript
test("rechaza numeroPedido ya asignado a otro repartidor", async () => {
  await crearRegistros("repartidor-1", [183]);
  const resultado = await crearRegistros("repartidor-2", [183]);
  expect(resultado.conflictos).toContainEqual(
    expect.objectContaining({ numeroPedido: 183, asignadoA: "repartidor-1" })
  );
});
```
