#!/bin/sh
set -eu

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILE="/backups/domicilios_${TIMESTAMP}.sql.gz"

PGPASSWORD="$POSTGRES_PASSWORD" pg_dump -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" | gzip > "$FILE"
echo "Dump creado: $FILE"

if [ -n "${RCLONE_REMOTE_PATH:-}" ]; then
  rclone copy "$FILE" "$RCLONE_REMOTE_PATH" --config /config/rclone/rclone.conf
  echo "Copiado a almacenamiento externo: $RCLONE_REMOTE_PATH"
else
  echo "RCLONE_REMOTE_PATH no configurado: el dump solo queda en el volumen local del backup, sin copia fuera del Droplet."
fi

# Retención local: conservar solo los últimos 7 dumps.
find /backups -name "domicilios_*.sql.gz" -mtime +7 -delete
