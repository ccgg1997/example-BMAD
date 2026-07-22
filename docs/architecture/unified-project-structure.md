# Unified Project Structure

```text
domicilios-san-pedro/
├── .github/
│   └── workflows/
│       ├── ci.yaml              # test + lint en cada push/PR
│       └── deploy.yaml          # build + deploy al VPS en push a main
├── app/
│   ├── login/page.tsx
│   ├── registro/page.tsx
│   ├── resumen/page.tsx         # incluye acordeón inline por repartidor, sin ruta anidada
│   ├── api/
│   │   ├── auth/login/route.ts
│   │   ├── auth/logout/route.ts
│   │   ├── repartidores/route.ts
│   │   ├── registros/route.ts
│   │   ├── resumen/route.ts
│   │   └── health/route.ts
│   └── layout.tsx
├── components/
│   ├── ui/                       # incluye accordion (shadcn)
│   ├── registro-salida-form.tsx
│   ├── resumen-table.tsx
│   └── repartidor-accordion-row.tsx
├── lib/
│   ├── db/
│   │   ├── client.ts
│   │   └── registros.ts
│   ├── services/
│   │   ├── registro.ts
│   │   └── resumen.ts
│   ├── auth.ts
│   ├── tarifa.ts
│   └── config.ts               # única puerta de entrada a process.env
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
│   ├── unit/
│   └── integration/
├── middleware.ts
├── docker-compose.yml
├── Dockerfile
├── Caddyfile
├── docs/
│   ├── brief.md
│   ├── prd.md
│   ├── front-end-spec.md
│   └── architecture.md
├── mockups/
│   ├── mockup1.png
│   └── mockup2.png
├── .env.example
├── package.json
└── README.md
```
