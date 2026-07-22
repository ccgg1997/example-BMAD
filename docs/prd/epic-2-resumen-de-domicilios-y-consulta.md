# Epic 2 Resumen de Domicilios y Consulta

Dar al propietario y a la auxiliar de mostrador visibilidad clara de cuántos pedidos lleva cada repartidor, cuánto se le debe pagar con la tarifa vigente, y permitir consultar el detalle de pedidos por repartidor para resolver dudas puntuales.

## Story 2.1 Cálculo de resumen de domicilios por repartidor

As a propietario de la droguería,
I want que el sistema calcule automáticamente cuántos pedidos lleva cada repartidor y cuánto le corresponde pagar,
so that no tenga que sumar manualmente desde una hoja de papel.

### Acceptance Criteria

1: El sistema calcula, para cada repartidor, la cantidad total de pedidos registrados en el período vigente (por ejemplo, la semana en curso).
2: El sistema calcula el valor a pagar multiplicando la cantidad de pedidos por la tarifa configurada (ver FR7).
3: El cálculo se actualiza automáticamente cada vez que se registra una nueva salida (ver Story 1.4).

## Story 2.2 Pantalla de Resumen de Domicilios

As a propietario de la droguería,
I want ver en una sola pantalla cuántos pedidos lleva cada repartidor y cuánto debo pagarle,
so that pueda cerrar el pago semanal sin revisar chats de WhatsApp ni hojas de papel.

### Acceptance Criteria

1: La pantalla lista todos los repartidores con pedidos registrados, mostrando cantidad de pedidos y valor a pagar por cada uno.
2: La información se puede consultar en cualquier momento sin pasos adicionales de navegación (ver Overall UX Vision).
3: La pantalla es usable desde un navegador móvil (ver NFR2).
4: La pantalla muestra la tarifa vigente por domicilio (ver FR7) en una tarjeta informativa visible al entrar.
5: La pantalla muestra un total agregado de la semana (suma de pedidos y valor a pagar de todos los repartidores), además del desglose por repartidor.

## Story 2.3 Consulta de pedidos por repartidor

As a auxiliar de mostrador,
I want consultar qué números de pedido tiene registrados un repartidor específico,
so that pueda resolver rápido la duda de quién se llevó un pedido determinado.

### Acceptance Criteria

1: Desde el Resumen de Domicilios, se puede seleccionar un repartidor y ver el listado de números de pedido registrados a su nombre.
2: El listado incluye la fecha/hora de registro de cada pedido.
3: La consulta no requiere buscar en WhatsApp ni en ningún registro externo al sistema.
