# User Actions

Acciones que solo el propietario (humano) puede realizar — ningún AI agent puede completarlas:

- Comprar/registrar el dominio que usará la aplicación (ej. `dominio-droguria.com`) y apuntar su DNS al Droplet.
- Crear la cuenta y el Droplet en DigitalOcean (o autorizar a alguien para hacerlo).
- Definir la clave (`APP_PASSWORD`) que usarán repartidores y propietario para entrar al sistema (ver Story 1.2).
- Opcional: crear cuenta gratuita en Sentry y obtener el `SENTRY_DSN`, y en UptimeRobot para el monitoreo de uptime.
- Confirmar si la numeración de pedidos deja de reiniciarse cada día (por fecha o consecutivo continuo) antes de que el equipo empiece a usar el sistema en producción — ver Additional Technical Assumptions.
- Confirmar si el tablero corre en un dispositivo compartido fijo o en los celulares individuales de cada repartidor.
