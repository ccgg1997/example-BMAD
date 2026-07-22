# Monitoring and Observability

## Monitoring Stack

- **Frontend Monitoring:** Sentry (captura de errores JS en cliente)
- **Backend Monitoring:** Sentry (captura de errores en Route Handlers)
- **Error Tracking:** Sentry (free tier), unificado frontend+backend
- **Performance Monitoring:** UptimeRobot haciendo ping a `/api/health` cada 5 min

## Key Metrics

**Frontend Metrics:**
- Core Web Vitals
- Errores de JavaScript
- Tiempos de respuesta de `/api/registros` y `/api/resumen`
- Interacciones de usuario (registro completado vs. abandonado)

**Backend Metrics:**
- Tasa de requests
- Tasa de error (4xx/5xx)
- Tiempo de respuesta
- Conflictos de duplicado detectados (métrica de negocio: valida que FR4 esté funcionando)
