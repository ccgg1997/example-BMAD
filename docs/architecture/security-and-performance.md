# Security and Performance

## Security Requirements

**Frontend Security:**
- CSP Headers: política básica restringiendo `script-src 'self'`
- XSS Prevention: escape automático de React + validación de que `numeroPedido` sea siempre numérico
- Secure Storage: cookie de sesión `httpOnly`, `secure`, `sameSite=strict` — nunca en localStorage

**Backend Security:**
- Input Validation: todo Route Handler valida el body con `zod` antes de tocar la base de datos
- Rate Limiting: límite estricto de intentos en `/api/auth/login` (ej. 5/min por IP) dado que es una password única compartida
- CORS Policy: mismo origen únicamente — no hay consumidores API externos

**Authentication Security:**
- Token Storage: cookie de sesión firmada (HMAC con `SESSION_SECRET`)
- Session Management: expiración larga (ej. 30 días) acorde a uso en dispositivo compartido cerca de la salida
- Password Policy: password única definida en variable de entorno, rotable manualmente por el propietario cuando lo considere necesario

## Performance Optimization

**Frontend Performance:**
- Bundle Size Target: mantenerse liviano dado que son 3 pantallas simples (shadcn/ui + Tailwind, sin librerías pesadas)
- Loading Strategy: Server Components para reducir JS enviado al cliente en resumen/detalle
- Caching Strategy: ninguna capa de cache explícita — el volumen de uso no lo requiere en el MVP

**Backend Performance:**
- Response Time Target: <300ms en `/api/registros` y `/api/resumen` bajo el volumen esperado (decenas de registros/día)
- Database Optimization: índices en `numero_pedido` (unique) y `repartidor_id` (ver Database Schema)
- Caching Strategy: ninguna — revisar solo si el volumen crece significativamente
