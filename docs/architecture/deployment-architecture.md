# Deployment Architecture

## Deployment Strategy

**Frontend Deployment:**
- **Platform:** Mismo contenedor que el backend (Next.js standalone output) — no hay CDN/edge separado.
- **Build Command:** `next build` (dentro del Dockerfile)
- **Output Directory:** `.next/standalone`
- **CDN/Edge:** Ninguno — Caddy sirve estáticos directamente; volumen de tráfico no lo justifica.

**Backend Deployment:**
- **Platform:** VPS DigitalOcean, contenedor Docker (Route Handlers dentro del mismo proceso Next.js)
- **Build Command:** `docker compose build`
- **Deployment Method:** GitHub Actions → SSH al VPS → `docker compose pull && docker compose up -d`

## CI/CD Pipeline

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /srv/domicilios-san-pedro
            git pull
            docker compose up -d --build
```

## Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|-------------|-------------|---------|
| Development | localhost:3000 | localhost:3000/api | Desarrollo local |
| Production | dominio-droguria.com | dominio-droguria.com/api | Entorno en vivo, único ambiente dado el tamaño del proyecto |

_Nota:_ no se define ambiente de Staging separado — el volumen y equipo de este MVP no lo justifica; los cambios se validan localmente y con prueba manual guiada antes de cada deploy a producción.
