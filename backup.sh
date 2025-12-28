#!/bin/bash
# Script to backup database to JSON

set -e

BACKUP_DIR="${1:-.backups}"
echo "Dumping database to JSON backups in $BACKUP_DIR..."

mkdir -p "$BACKUP_DIR"

python manage.py dump_data --output "$BACKUP_DIR"

echo "Backup completed successfully!"
ls -lh "$BACKUP_DIR"/*.json
