#!/bin/bash
set -e

echo "==> Restaurando backup do banco BE-STRONG..."
pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" /docker-entrypoint-initdb.d/be_strong.dump
echo "==> Backup restaurado com sucesso!"
