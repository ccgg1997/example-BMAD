# Development Workflow

## Local Development Setup

### Prerequisites

```bash
node --version   # >= 20
docker --version
docker compose version
```

### Initial Setup

```bash
git clone <repo>
cd domicilios-san-pedro
cp .env.example .env
npm install
docker compose up -d db
npx prisma migrate dev
```

### Development Commands

```bash
# Start all services (app + db vía Docker Compose)
docker compose up -d

# Modo desarrollo local (fuera de Docker, apuntando a db en Docker)
npm run dev

# Run tests
npm run test
```

## Environment Configuration

### Required Environment Variables

```bash
# App (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/domicilios
APP_PASSWORD=clave-compartida-del-negocio
SESSION_SECRET=una-cadena-aleatoria-larga
SENTRY_DSN=                       # opcional
```
