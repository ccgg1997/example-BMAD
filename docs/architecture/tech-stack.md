# Tech Stack

## Technology Stack Table

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
