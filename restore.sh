#!/bin/bash
# Script to restore database from JSON

set -e

BACKUP_DIR="${1:-.backups}"
echo "Loading database from JSON backups in $BACKUP_DIR..."

if [ ! -d "$BACKUP_DIR" ]; then
    echo "Backup directory $BACKUP_DIR not found!"
    exit 1
fi

python manage.py load_data --input "$BACKUP_DIR"

echo "Restore completed successfully!"
