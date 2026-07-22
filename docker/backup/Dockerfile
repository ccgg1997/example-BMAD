FROM postgres:16-alpine

RUN apk add --no-cache dcron rclone

COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh

COPY crontab /etc/crontabs/root

RUN mkdir -p /backups /config/rclone

CMD ["crond", "-f", "-l", "2"]
