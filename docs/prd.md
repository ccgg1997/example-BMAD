# Domicilios San Pedro Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Eliminar la doble asignación de un mismo pedido a dos repartidores.
- Dar al propietario visibilidad inmediata de cuántos domicilios lleva cada repartidor y cuánto debe pagársele.
- Reducir a cero la brecha semanal entre domicilios reportados por el repartidor y domicilios registrados.
- Reemplazar la hoja de papel y la memoria/celular de cada repartidor como fuente de verdad de los domicilios.
- Ofrecer un registro tan simple y rápido que los repartidores lo usen sin fricción, incluso con prisa.

### Background Context

La Droguería San Pedro es un negocio pequeño de 9 meses de operación que vende en mostrador, por llamadas y por WhatsApp, todo por el mismo número de teléfono. Los pedidos de domicilio se anotan hoy en una hoja de papel — a veces sin número, con descripciones informales — mientras cada repartidor lleva su propia cuenta de memoria o en el celular. Estas tres fuentes casi nunca coinciden: la semana pasada un repartidor reportó 41 domicilios frente a 35 registrados en la hoja, y un pedido quedó en disputa entre dos repartidores que creían que les correspondía a ambos.

Este PRD cubre exclusivamente el primer recorte de alcance acordado con el propietario: un tablero de registro de salida y resumen de domicilios. Quedan fuera de este documento — por decisión explícita del propietario para no sobre-construir un sistema que nadie use — la gestión de citas médicas, el control de inventario, las alertas de vencimiento, los estados de entrega y la conciliación de pagos. Estos temas se abordarán en una fase posterior, tras una segunda sesión de descubrimiento.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-07-22 | 0.1 | Borrador inicial del PRD generado en modo YOLO a partir del Project Brief | John (PM) |

## Requirements

### Functional

1. FR1: El sistema debe permitir seleccionar un repartidor de una lista (Carlos, Diego, Andrés, y futuros repartidores que se agreguen) antes de registrar una salida.
2. FR2: El sistema debe permitir ingresar uno o varios números de pedido en una sola operación de registro de salida.
3. FR3: El sistema debe guardar cada registro de salida con repartidor, número(s) de pedido y fecha/hora del registro.
4. FR4: El sistema debe impedir que un número de pedido ya asignado a un repartidor sea asignado simultáneamente a otro repartidor, mostrando un mensaje claro de conflicto.
5. FR5: El sistema debe mostrar un resumen por repartidor con la cantidad de pedidos acumulados y el valor estimado a pagar, calculado con la tarifa fija vigente por pedido.
6. FR6: El sistema debe permitir consultar, para un repartidor específico, el listado de números de pedido registrados a su nombre.
7. FR7: El sistema debe permitir configurar la tarifa fija por domicilio (inicialmente $1.000 COP) sin requerir cambios de código.
8. FR8: El sistema debe generar o aceptar números de pedido que no se dupliquen entre días distintos (evitando el reinicio diario de la numeración que hoy causa ambigüedad).

### Non Functional

1. NFR1: El registro de salida debe completarse en menos de 15 segundos en un flujo típico (seleccionar repartidor + ingresar números de pedido).
2. NFR2: La interfaz debe ser utilizable desde un navegador móvil (celular o tableta) sin necesidad de instalar una aplicación nativa.
3. NFR3: El sistema debe funcionar de forma confiable con conexión a internet intermitente propia de un punto de venta de barrio (tolerar reintentos, evitar pérdida de datos por errores de red).
4. NFR4: El sistema no debe capturar ni almacenar datos clínicos, dirección, teléfono o nombre del cliente — el alcance de datos se limita a repartidor, número de pedido y fecha/hora.
5. NFR5: El costo de hosting e infraestructura debe mantenerse bajo, acorde al tamaño de un negocio pequeño (preferir niveles gratuitos o de bajo costo de los proveedores elegidos).

## User Interface Design Goals

### Overall UX Vision

Una interfaz mínima, de muy pocos pasos, pensada para usarse de pie y con prisa en la puerta de la droguería. Prioriza botones grandes y listas de selección sobre formularios de texto libre, evitando cualquier campo que no sea estrictamente necesario para registrar una salida o consultar el resumen.

### Key Interaction Paradigms

- Selección por toque (nombre del repartidor, no texto libre) para minimizar errores de escritura.
- Ingreso de números de pedido como lista corta (agregar/quitar), no como formulario extenso.
- Confirmación inmediata y visible al registrar la salida ("Registrado" o mensaje de conflicto si el pedido ya fue tomado).
- Resumen de domicilios como vista de solo lectura, sin pasos adicionales de navegación.

### Core Screens and Views

- Pantalla de Registro de Salida (selección de repartidor + números de pedido + botón "Registrar salida")
- Pantalla de Resumen de Domicilios (lista de repartidores con conteo y valor a pagar)
- Vista de Detalle por Repartidor (números de pedido registrados a su nombre)

### Accessibility: None

Sin requerimientos formales de accesibilidad (WCAG) para este MVP dado el contexto de uso (equipo interno reducido); se recomienda buen contraste y tamaños de toque grandes por buenas prácticas, sin ser un requisito formal.

### Branding

Validado con mockups de alta fidelidad (`mockups/mockup1.png`, `mockups/mockup2.png`): logo de ícono casa con cruz + nombre "Domicilios San Pedro" (subtítulo "Droguería"), paleta verde/teal como color primario (éxito, elementos activos), rojo/rosa para conflictos. Detalle completo en `docs/front-end-spec.md`, sección Branding & Style Guide.

### Target Device and Platforms: Web Responsive

Aplicación web responsive, accesible desde el navegador de un celular o de una tableta ubicada cerca de la salida — sin requerir instalación.

## Technical Assumptions

### Repository Structure: Monorepo

Un único repositorio para frontend y backend, dado el tamaño reducido del proyecto y del equipo de desarrollo. Simplifica el despliegue y el mantenimiento para un MVP de este alcance.

### Service Architecture

**Monolito.** No se justifica una arquitectura de microservicios ni serverless distribuido para un tablero de dos pantallas con un equipo de usuarios de menos de 10 personas. Se recomienda una aplicación full-stack tipo Next.js (React + API routes en el mismo proyecto) con una base de datos relacional ligera (por ejemplo PostgreSQL gestionado, tipo Neon o Supabase), desplegada en un proveedor de bajo costo (por ejemplo Vercel). Esta recomendación se documenta como punto de partida para el Architect, no como decisión cerrada — el propietario no expresó preferencia técnica.

### Testing Requirements

**Unit + Integration.** Pruebas unitarias sobre la lógica de negocio crítica (validación de duplicados, cálculo del resumen y valor a pagar) y pruebas de integración sobre los endpoints de registro de salida y resumen. No se requiere e2e automatizado para el MVP dado el tamaño del equipo; se recomienda prueba manual guiada antes de cada entrega al propietario.

### Additional Technical Assumptions and Requests

- El sistema de caja (POS) actual no se integra en este MVP; se mantiene como sistema aparte.
- Debe definirse con el propietario, antes o durante el desarrollo, si la numeración de pedidos deja de reiniciarse cada día (por fecha o como consecutivo continuo) — ver FR8.
- Debe definirse si el tablero corre en un dispositivo compartido fijo cerca de la salida o en los celulares individuales de cada repartidor — esto no cambia los requisitos funcionales pero sí las consideraciones de sesión/autenticación por dispositivo.
- Sin presupuesto ni timeline formal definidos por el propietario; se recomienda preferir servicios de nivel gratuito o de bajo costo.

## Epic List

- **Epic 1: Fundamento, Autenticación y Registro de Salida** — Establecer la base técnica del proyecto, proteger el acceso con una clave compartida, y permitir que un repartidor registre, sin fricción y sin conflictos, los pedidos que se lleva al salir.
- **Epic 2: Resumen de Domicilios y Consulta** — Dar al propietario visibilidad del conteo y valor a pagar por repartidor, y permitir consultar qué pedidos tiene cada uno.

Dos épicas son suficientes para este MVP: la primera entrega el flujo de captura (con la base técnica, autenticación y seed de datos necesarios), la segunda entrega el flujo de consulta y pago que es el objetivo de negocio final. No se identifican bloques adicionales de valor independiente dentro del alcance acordado.

## Epic 1 Fundamento, Autenticación y Registro de Salida

Establecer la infraestructura base del proyecto (repositorio, base de datos, despliegue), proteger el acceso con una clave compartida, sembrar los datos iniciales de repartidores, y entregar el flujo completo de registro de salida: un repartidor selecciona su nombre, ingresa los números de pedido que se lleva, y el sistema los guarda impidiendo que un mismo pedido quede asignado a dos repartidores a la vez.

### Story 1.1 Configuración base del proyecto y despliegue

As a propietario de la droguería,
I want que exista una aplicación web desplegada y accesible desde un celular,
so that el equipo pueda empezar a usar el sistema desde el primer día sin depender de instalaciones.

#### Acceptance Criteria

1: El repositorio del proyecto está creado con la estructura de proyecto único Next.js definida en Technical Assumptions y Architecture.
2: La aplicación está desplegada vía Docker Compose (app + PostgreSQL + Caddy como reverse proxy con HTTPS) en un entorno accesible por URL desde un navegador móvil.
3: Existe un endpoint de verificación (`/api/health`) que confirma que la aplicación y su conexión a base de datos están funcionando.
4: La base de datos relacional está aprovisionada, conectada a la aplicación, y con las migraciones iniciales de Prisma aplicadas.
5: El pipeline de CI/CD (GitHub Actions) está configurado: corre pruebas en cada push y despliega automáticamente a producción al hacer merge a main.
6: Los frameworks de testing (Vitest + React Testing Library) están instalados y configurados, con al menos una prueba de ejemplo pasando.
7: Tailwind CSS y shadcn/ui están instalados y configurados como base de estilos para las siguientes historias.

### Story 1.2 Autenticación con Password Compartida

As a propietario de la droguería,
I want que la aplicación pida una clave antes de dejar entrar a cualquiera,
so that el sistema no quede abierto a cualquiera que encuentre la URL en internet.

#### Acceptance Criteria

1: Existe una pantalla de login que pide una única clave (password compartida, sin usuarios individuales).
2: Si la clave es correcta, se otorga una sesión (cookie firmada, httpOnly, secure) que da acceso a las demás pantallas.
3: Si la clave es incorrecta, se muestra un mensaje de error y no se otorga sesión.
4: Cualquier pantalla del sistema (Registro de Salida, Resumen de Domicilios, Detalle por Repartidor) redirige a login si no hay sesión válida.
5: La clave se configura mediante variable de entorno, no está escrita en el código.
6: Existe un límite de intentos de login por minuto para dificultar ataques de fuerza bruta sobre la clave única.

### Story 1.3 Modelo de datos de repartidores y pedidos

As a desarrollador del sistema,
I want un modelo de datos que represente repartidores y registros de salida de pedidos,
so that el sistema pueda guardar y consultar de forma confiable quién lleva cada pedido.

#### Acceptance Criteria

1: Existe una entidad Repartidor con al menos nombre e identificador único.
2: Existe una entidad Pedido/Registro de Salida con repartidor asignado, número de pedido, y fecha/hora de registro.
3: El número de pedido no se reinicia por día (ver FR8); el modelo garantiza unicidad del número de pedido a nivel de todo el sistema o de un rango temporal definido con el propietario.
4: La tarifa por domicilio es un valor configurable (ver FR7), no un valor fijo en código.
5: Existe un script de seed que crea los repartidores iniciales conocidos hoy (Carlos, Diego, Andrés) y la fila inicial de tarifa ($1.000 COP), de forma que la Story 1.4 tenga datos reales con los que probar.

### Story 1.4 Pantalla de Registro de Salida

As a repartidor,
I want seleccionar mi nombre e ingresar los números de los pedidos que me llevo,
so that quede registrado rápidamente qué pedidos tengo, sin llenar formularios largos.

#### Acceptance Criteria

1: La pantalla permite seleccionar el nombre del repartidor de una lista, sin escribir texto libre.
2: La pantalla permite agregar uno o varios números de pedido antes de confirmar.
3: Al presionar "Registrar salida", los pedidos ingresados quedan guardados con el repartidor y la fecha/hora actual.
4: El flujo completo (seleccionar repartidor + ingresar pedidos + confirmar) toma menos de 15 segundos en un caso típico de 1 a 3 pedidos (ver NFR1).
5: La interfaz es usable desde un navegador móvil (ver NFR2).
6: La pantalla solo es accesible con sesión válida (ver Story 1.2); sin sesión, redirige a login.

### Story 1.5 Validación de doble asignación de pedidos

As a propietario de la droguería,
I want que el sistema impida que un mismo número de pedido sea registrado por dos repartidores distintos,
so that no se repita la confusión de no saber quién tiene realmente un pedido.

#### Acceptance Criteria

1: Si un repartidor intenta registrar un número de pedido ya asignado a otro repartidor, el sistema rechaza el registro de ese número.
2: El sistema muestra un mensaje claro indicando que el pedido ya fue asignado y a quién.
3: Los demás números de pedido válidos en el mismo intento de registro sí se guardan correctamente (un conflicto no bloquea el resto del lote).

## Epic 2 Resumen de Domicilios y Consulta

Dar al propietario y a la auxiliar de mostrador visibilidad clara de cuántos pedidos lleva cada repartidor, cuánto se le debe pagar con la tarifa vigente, y permitir consultar el detalle de pedidos por repartidor para resolver dudas puntuales.

### Story 2.1 Cálculo de resumen de domicilios por repartidor

As a propietario de la droguería,
I want que el sistema calcule automáticamente cuántos pedidos lleva cada repartidor y cuánto le corresponde pagar,
so that no tenga que sumar manualmente desde una hoja de papel.

#### Acceptance Criteria

1: El sistema calcula, para cada repartidor, la cantidad total de pedidos registrados en el período vigente (por ejemplo, la semana en curso).
2: El sistema calcula el valor a pagar multiplicando la cantidad de pedidos por la tarifa configurada (ver FR7).
3: El cálculo se actualiza automáticamente cada vez que se registra una nueva salida (ver Story 1.4).

### Story 2.2 Pantalla de Resumen de Domicilios

As a propietario de la droguería,
I want ver en una sola pantalla cuántos pedidos lleva cada repartidor y cuánto debo pagarle,
so that pueda cerrar el pago semanal sin revisar chats de WhatsApp ni hojas de papel.

#### Acceptance Criteria

1: La pantalla lista todos los repartidores con pedidos registrados, mostrando cantidad de pedidos y valor a pagar por cada uno.
2: La información se puede consultar en cualquier momento sin pasos adicionales de navegación (ver Overall UX Vision).
3: La pantalla es usable desde un navegador móvil (ver NFR2).
4: La pantalla muestra la tarifa vigente por domicilio (ver FR7) en una tarjeta informativa visible al entrar.
5: La pantalla muestra un total agregado de la semana (suma de pedidos y valor a pagar de todos los repartidores), además del desglose por repartidor.

### Story 2.3 Consulta de pedidos por repartidor

As a auxiliar de mostrador,
I want consultar qué números de pedido tiene registrados un repartidor específico,
so that pueda resolver rápido la duda de quién se llevó un pedido determinado.

#### Acceptance Criteria

1: Desde el Resumen de Domicilios, se puede seleccionar un repartidor y ver el listado de números de pedido registrados a su nombre.
2: El listado incluye la fecha/hora de registro de cada pedido.
3: La consulta no requiere buscar en WhatsApp ni en ningún registro externo al sistema.

## User Actions

Acciones que solo el propietario (humano) puede realizar — ningún AI agent puede completarlas:

- Comprar/registrar el dominio que usará la aplicación (ej. `dominio-droguria.com`) y apuntar su DNS al Droplet.
- Crear la cuenta y el Droplet en DigitalOcean (o autorizar a alguien para hacerlo).
- Definir la clave (`APP_PASSWORD`) que usarán repartidores y propietario para entrar al sistema (ver Story 1.2).
- Opcional: crear cuenta gratuita en Sentry y obtener el `SENTRY_DSN`, y en UptimeRobot para el monitoreo de uptime.
- Confirmar si la numeración de pedidos deja de reiniciarse cada día (por fecha o consecutivo continuo) antes de que el equipo empiece a usar el sistema en producción — ver Additional Technical Assumptions.
- Confirmar si el tablero corre en un dispositivo compartido fijo o en los celulares individuales de cada repartidor.

## Checklist Results Report

Validado mediante **PO Master Checklist** (cross-documento, cubre PRD + Architecture + secuenciación). Resultado inicial: **CONDITIONAL** por 2 vacíos bloqueantes — falta de historia de autenticación y falta de seed de datos iniciales. Ambos se corrigieron en esta versión del PRD:

- Se agregó **Story 1.2: Autenticación con Password Compartida** (antes ausente pese a estar en Architecture).
- Se agregó AC de seed de datos iniciales en **Story 1.3** (repartidores + tarifa).
- Se amplió el AC de **Story 1.1** para cubrir explícitamente Docker Compose, CI/CD, testing y Tailwind/shadcn — antes implícitos, ahora explícitos para que el dev agent no los omita.
- Se agregó la sección **User Actions** para separar lo que le corresponde al propietario de lo que hace el equipo de desarrollo.

Pendientes de nivel arquitectura (no bloquean el inicio del desarrollo, pero deben resolverse dentro de Story 1.1 o como historias posteriores): estrategia de backup de PostgreSQL, retry/idempotencia en el cliente para tolerar conexión intermitente (NFR3), y firewall del VPS — ver `docs/architecture.md`, sección Checklist Results Report.

## Next Steps

### UX Expert Prompt

Usa este PRD (`docs/prd.md`) como entrada para definir el flujo de pantallas de Domicilios San Pedro, enfocado en la sección "User Interface Design Goals": Registro de Salida, Resumen de Domicilios y Detalle por Repartidor. Prioriza mínima fricción de captura para el repartidor y lectura inmediata para el propietario, en un diseño web responsive sin marca definida.

### Architect Prompt

Usa este PRD (`docs/prd.md`) como entrada para definir la arquitectura de Domicilios San Pedro. Punto de partida sugerido en "Technical Assumptions": monorepo, monolito full-stack (ej. Next.js) con base de datos relacional ligera, sin integración con el POS actual. Resuelve especialmente el modelo de datos que garantice unicidad de número de pedido (FR8) y el bloqueo de doble asignación (Story 1.4).
