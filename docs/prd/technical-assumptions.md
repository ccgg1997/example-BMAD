# Technical Assumptions

## Repository Structure: Monorepo

Un único repositorio para frontend y backend, dado el tamaño reducido del proyecto y del equipo de desarrollo. Simplifica el despliegue y el mantenimiento para un MVP de este alcance.

## Service Architecture

**Monolito.** No se justifica una arquitectura de microservicios ni serverless distribuido para un tablero de dos pantallas con un equipo de usuarios de menos de 10 personas. Se recomienda una aplicación full-stack tipo Next.js (React + API routes en el mismo proyecto) con una base de datos relacional ligera (por ejemplo PostgreSQL gestionado, tipo Neon o Supabase), desplegada en un proveedor de bajo costo (por ejemplo Vercel). Esta recomendación se documenta como punto de partida para el Architect, no como decisión cerrada — el propietario no expresó preferencia técnica.

## Testing Requirements

**Unit + Integration.** Pruebas unitarias sobre la lógica de negocio crítica (validación de duplicados, cálculo del resumen y valor a pagar) y pruebas de integración sobre los endpoints de registro de salida y resumen. No se requiere e2e automatizado para el MVP dado el tamaño del equipo; se recomienda prueba manual guiada antes de cada entrega al propietario.

## Additional Technical Assumptions and Requests

- El sistema de caja (POS) actual no se integra en este MVP; se mantiene como sistema aparte.
- Debe definirse con el propietario, antes o durante el desarrollo, si la numeración de pedidos deja de reiniciarse cada día (por fecha o como consecutivo continuo) — ver FR8.
- Debe definirse si el tablero corre en un dispositivo compartido fijo cerca de la salida o en los celulares individuales de cada repartidor — esto no cambia los requisitos funcionales pero sí las consideraciones de sesión/autenticación por dispositivo.
- Sin presupuesto ni timeline formal definidos por el propietario; se recomienda preferir servicios de nivel gratuito o de bajo costo.
