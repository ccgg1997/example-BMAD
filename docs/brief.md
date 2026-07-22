# Project Brief: Domicilios San Pedro

## Executive Summary

Tablero simple, accesible desde celular o tableta, que permite a los repartidores de la Droguería San Pedro registrar los pedidos que llevan al salir, y al propietario consultar en cualquier momento cuántos domicilios acumula cada repartidor y cuánto debe pagársele. El problema principal a resolver es la falta de trazabilidad sobre qué pedidos lleva cada repartidor y las discrepancias recurrentes en el conteo de domicilios al momento del pago. El mercado objetivo es una droguería pequeña e independiente con servicio de domicilios y un equipo reducido y de disponibilidad irregular. La propuesta de valor es eliminar confusiones de pedidos duplicados o perdidos y las diferencias de pago, sin agregar carga operativa: el registro debe ser tan simple que un repartidor lo use "en la puerta, con el casco puesto".

## Problem Statement

**Estado actual y puntos de dolor:** Los pedidos llegan mezclados por WhatsApp, llamadas y mostrador, todos al mismo número de teléfono (precios, fórmulas médicas, citas del médico y solicitudes de domicilio en el mismo chat). El registro de pedidos se hace en una hoja de papel, a veces sin número, con descripciones informales ("el de los pañales", "la señora de la esquina"). Los repartidores llevan su propia cuenta de memoria o en el celular, desincronizada de la hoja del mostrador.

**Impacto:** La semana pasada Carlos reportó 41 domicilios, la hoja solo tenía 35 registrados; tras revisar WhatsApp aparecieron 4 más y se le pagaron 39, sin que se supiera qué pasó con los otros 2. El pedido 183 quedó en disputa entre Carlos y Diego, cada uno creyendo que le correspondía. Un pedido de pañales y pastillas para la presión quedó olvidado en el mostrador porque se asumió que ya había sido entregado. Esto genera pagos incorrectos a los repartidores, entregas tardías u omitidas, y discusiones semanales al momento de pagar (domingo en la noche o lunes).

**Por qué las soluciones actuales no alcanzan:** La hoja de papel no previene que un mismo pedido quede asignado a dos repartidores ni da un conteo objetivo. El sistema de caja (POS) no cubre domicilios y muchas veces se alimenta después de que el repartidor ya salió. La numeración de pedidos reinicia desde 1 cada día, generando ambigüedad entre días distintos.

**Urgencia:** El problema se repite todas las semanas y se agrava los sábados, cuando coinciden consultas médicas, ventas de mostrador, solicitudes por WhatsApp y salida de domicilios al mismo tiempo. El propietario pidió explícitamente empezar por este punto — antes que citas médicas, inventario o conciliación de pagos — por ser el más frecuente y el más simple de resolver primero.

## Proposed Solution

**Concepto central:** Un tablero de dos secciones, accesible desde celular o tableta ubicada cerca de la salida:

1. **Registro de salida** — el repartidor selecciona su nombre, ingresa uno o varios números de pedido y presiona "Registrar salida". El sistema impide que un mismo número de pedido quede asignado simultáneamente a dos repartidores.
2. **Resumen de domicilios** — el propietario (y la auxiliar de mostrador) consulta cuántos pedidos lleva cada repartidor y el valor estimado a pagar, con tarifa fija inicial de $1.000 COP por pedido, pudiendo ver el detalle de números de pedido por repartidor.

**Diferenciador clave:** Fricción mínima de captura — solo nombre y número de pedido — diseñada explícitamente para que los repartidores jóvenes y con afán realmente la usen (validado con Diego en la reunión: pidió algo tan simple como "seleccionar el nombre y poner el número del pedido").

**Por qué funcionará donde el papel no:** Registro estructurado con validación de duplicados en tiempo real, y una única fuente de verdad en lugar de tres registros paralelos que hoy nunca coinciden (hoja del mostrador, memoria del repartidor, chats de WhatsApp).

**Visión de alto nivel:** Empezar acotado y crecer en fases hacia estados de entrega, conciliación de pagos, citas médicas e inventario — evitando construir de entrada un sistema grande que termine sin usarse, preocupación explícita del propietario.

## Target Users

### Primary User Segment: Repartidores

Carlos, Diego y Andrés — jóvenes que estudian, sin horario fijo, uno de ellos solo trabaja fines de semana. Hoy reciben las bolsas de pedidos verbalmente en la puerta y cuentan sus domicilios de memoria o en el celular. Necesitan un registro rápido, sin campos adicionales (nada de dirección, teléfono ni datos de pago), que no les quite tiempo al salir. Su meta es que se les pague correctamente por lo que efectivamente entregaron, sin discusiones cada semana.

### Secondary User Segment: Propietario y auxiliar de mostrador

Pedro (propietario) y Martha (auxiliar de mostrador) — operan el mostrador y asignan los pedidos verbalmente a los repartidores. Hoy escriben en una hoja de papel, muchas veces sin número o con descripciones informales. Necesitan saber en cualquier momento qué repartidor tiene qué pedido y cuánto se le debe pagar, sin tener que revisar los chats de WhatsApp. Su meta es un pago justo, sin discusiones, y un cierre de caja de domicilios ágil los domingos o lunes.

## Goals & Success Metrics

### Business Objectives

- Eliminar las discrepancias entre lo que reporta el repartidor y lo efectivamente registrado (hoy con brechas de hasta 2 pedidos por semana, caso Carlos).
- Reducir el tiempo de conciliación semanal del pago de domicilios, hoy dependiente de revisar manualmente los chats de WhatsApp.

### User Success Metrics

- Un repartidor registra su salida (nombre + números de pedido) en menos de 15 segundos.
- El propietario puede ver el resumen de domicilios del día sin preguntarle a nadie.

### Key Performance Indicators (KPIs)

- **Pedidos con repartidor único asignado:** 100% — el sistema bloquea toda doble asignación.
- **Diferencia entre domicilios reportados por el repartidor y los registrados en el sistema:** 0 por semana.
- **Tiempo de cierre del pago semanal de domicilios:** pasar de un proceso manual (hoja + revisión de WhatsApp) a una consulta directa del resumen.

## MVP Scope

### Core Features (Must Have)

- **Registro de salida:** selección del repartidor + ingreso de uno o varios números de pedido + botón "Registrar salida". Es el flujo mínimo validado con Diego como usable "en la puerta, con el casco puesto".
- **Validación de duplicados:** el sistema impide que un número de pedido quede asignado simultáneamente a dos repartidores. Resuelve directamente el caso del pedido 183 (Carlos vs. Diego).
- **Resumen de domicilios por repartidor:** cantidad de pedidos acumulados y valor estimado a pagar, con tarifa fija de $1.000 por pedido. Resuelve la disputa semanal de pago (caso Carlos: 41 reportados vs. 35 registrados).
- **Consulta de pedidos por repartidor:** ver qué números de pedido están registrados bajo cada nombre. Solicitado explícitamente por Martha para "buscar quién se llevó" un pedido.

### Out of Scope for MVP

- Gestión de citas médicas (agenda del sábado, y futura del miércoles).
- Control de inventario / reemplazo del cuaderno de existencias.
- Alertas de medicamentos próximos a vencer (requiere manejo de lotes y fechas).
- Estados de entrega (entregado, devuelto, cliente no disponible).
- Conciliación de pagos por medio (efectivo, transferencia, datáfono).
- Integración con WhatsApp.
- Dirección, teléfono, nombre del cliente, medicamento o información clínica del pedido.
- Tarifas especiales de domicilio (domicilios lejanos, bonos de domingo) — el MVP usa tarifa única de $1.000.

### MVP Success Criteria

El propietario puede, sin preguntarle a nadie, saber cuántos pedidos lleva cada repartidor y cuánto debe pagarle al cierre de la semana, y ningún número de pedido queda asignado a dos repartidores al mismo tiempo.

## Post-MVP Vision

### Phase 2 Features

Gestión de citas médicas del sábado (y futuro miércoles), estados de entrega (entregado / devuelto), tarifas especiales de domicilio, conciliación de pagos por medio de pago.

### Long-term Vision

Alertas de vencimiento de medicamentos por lote y fecha; integración con WhatsApp para separar tipos de solicitud del mismo número de teléfono (precios, fórmulas, citas, domicilios).

### Expansion Opportunities

Control de inventario ligado a ventas de mostrador y WhatsApp; ampliación del consultorio médico a más días de atención.

## Technical Considerations

### Platform Requirements

- **Target Platforms:** Web app accesible desde celular o tableta ubicada cerca de la salida de la droguería.
- **Browser/OS Support:** No discutido en la reunión — pendiente de definir con Architect.
- **Performance Requirements:** Uso bajo prisa (repartidor con casco puesto, esperando en la puerta) — la interfaz debe permitir registrar en pocos toques y segundos.

### Technology Preferences

No discutido en la reunión — pendiente de definir con Architect.

### Architecture Considerations

- **Repository Structure:** Pendiente.
- **Service Architecture:** Pendiente.
- **Integration Requirements:** El sistema de caja (POS) actual no se integra en este MVP; es un sistema aparte que no controla domicilios.
- **Security/Compliance:** No discutido — el MVP no maneja datos clínicos ni de contacto del cliente, lo que reduce el alcance de datos sensibles.

## Constraints & Assumptions

### Constraints

- **Budget:** No discutido en la reunión.
- **Timeline:** No definido explícitamente; el propietario quiere iniciar acotado ("no quiero arrancar con un sistema demasiado grande porque después nadie lo usa").
- **Resources:** Equipo pequeño — propietario, una auxiliar y tres repartidores con disponibilidad irregular; sin equipo técnico propio.
- **Technical:** Debe funcionar de forma simple y rápida en dispositivos móviles, sin fricción de captura.

### Key Assumptions

- La numeración de pedidos podría dejar de reiniciarse cada día (por fecha o como consecutivo continuo) — pendiente de decisión del propietario.
- Los repartidores tienen acceso a un celular propio o a una tableta compartida cerca de la salida.
- La tarifa de $1.000 por domicilio es fija para el MVP; las excepciones (domicilios lejanos, bonos de domingo) se siguen manejando fuera del sistema por ahora.
- Habrá una segunda sesión de descubrimiento para citas médicas, WhatsApp, vencimientos y conciliación de pagos.

## Risks & Open Questions

### Key Risks

- **Adopción:** si el registro exige más que nombre + número de pedido, los repartidores podrían dejar de usarlo — riesgo validado explícitamente por Diego en la reunión.
- **Numeración ambigua:** si no se corrige el reinicio diario de los números de pedido antes del lanzamiento, podrían chocar pedidos con el mismo número en días distintos.
- **Doble fuente de verdad:** si el sistema de caja (POS) y este tablero no quedan claramente separados en su función, se puede volver a mezclar el registro de domicilios.

### Open Questions

- ¿Se corrige la numeración de pedidos (por fecha o consecutivo continuo) antes o durante el desarrollo del MVP?
- ¿El tablero será un dispositivo compartido y fijo cerca de la salida, o cada repartidor usará su propio celular?
- ¿Quién más, además del propietario y la auxiliar de mostrador, necesita ver el resumen de domicilios?

### Areas Needing Further Research

- Flujo de citas médicas del sábado (y futuro miércoles) para la fase 2.
- Proceso de conciliación de pagos entre efectivo, transferencia y datáfono.
- Integración futura con WhatsApp para separar tipos de solicitud en el mismo chat.

## Appendices

### A. Research Summary

Este brief se basa en la reunión de descubrimiento inicial realizada por Microsoft Teams (transcripción completa en `context/conversacion_teams_drogueria_formato_chat.txt`), con la participación de Pedro (propietario), Martha (auxiliar de mostrador) y Diego (repartidor), facilitada por Laura (analista de producto de GoEcosystem).

### C. References

- `context/conversacion_teams_drogueria_formato_chat.txt`

## Next Steps

### Immediate Actions

1. Confirmar con el propietario si cambiará la numeración de pedidos (por fecha o consecutivo continuo) antes de iniciar el desarrollo.
2. Definir si el tablero corre en un dispositivo compartido fijo o en los celulares individuales de los repartidores.
3. Entregar este brief al PM para iniciar el PRD del MVP (Registro de Salida + Resumen de Domicilios).
4. Agendar la segunda sesión de descubrimiento para citas médicas, WhatsApp, vencimientos y conciliación de pagos.

### PM Handoff

Este Project Brief da el contexto completo de Domicilios San Pedro. Iniciar en modo 'PRD Generation Mode', revisar el brief a fondo para trabajar con el usuario en la creación del PRD sección por sección según la plantilla, preguntando cualquier aclaración necesaria o sugiriendo mejoras.
