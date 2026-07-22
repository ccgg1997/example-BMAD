# Requirements

## Functional

1. FR1: El sistema debe permitir seleccionar un repartidor de una lista (Carlos, Diego, Andrés, y futuros repartidores que se agreguen) antes de registrar una salida.
2. FR2: El sistema debe permitir ingresar uno o varios números de pedido en una sola operación de registro de salida.
3. FR3: El sistema debe guardar cada registro de salida con repartidor, número(s) de pedido y fecha/hora del registro.
4. FR4: El sistema debe impedir que un número de pedido ya asignado a un repartidor sea asignado simultáneamente a otro repartidor, mostrando un mensaje claro de conflicto.
5. FR5: El sistema debe mostrar un resumen por repartidor con la cantidad de pedidos acumulados y el valor estimado a pagar, calculado con la tarifa fija vigente por pedido.
6. FR6: El sistema debe permitir consultar, para un repartidor específico, el listado de números de pedido registrados a su nombre.
7. FR7: El sistema debe permitir configurar la tarifa fija por domicilio (inicialmente $1.000 COP) sin requerir cambios de código.
8. FR8: El sistema debe generar o aceptar números de pedido que no se dupliquen entre días distintos (evitando el reinicio diario de la numeración que hoy causa ambigüedad).

## Non Functional

1. NFR1: El registro de salida debe completarse en menos de 15 segundos en un flujo típico (seleccionar repartidor + ingresar números de pedido).
2. NFR2: La interfaz debe ser utilizable desde un navegador móvil (celular o tableta) sin necesidad de instalar una aplicación nativa.
3. NFR3: El sistema debe funcionar de forma confiable con conexión a internet intermitente propia de un punto de venta de barrio (tolerar reintentos, evitar pérdida de datos por errores de red).
4. NFR4: El sistema no debe capturar ni almacenar datos clínicos, dirección, teléfono o nombre del cliente — el alcance de datos se limita a repartidor, número de pedido y fecha/hora.
5. NFR5: El costo de hosting e infraestructura debe mantenerse bajo, acorde al tamaño de un negocio pequeño (preferir niveles gratuitos o de bajo costo de los proveedores elegidos).
