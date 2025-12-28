#!/bin/bash
# Cron job script for automated daily backups
# Usage: Add to crontab: 0 2 * * * /path/to/pet-adoption/auto-backup.sh

PROJECT_DIR="/home/dev_f/basic/Pet-Adoption"
BACKUP_DIR="$PROJECT_DIR/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATED_BACKUP_DIR="$BACKUP_DIR/backup_$TIMESTAMP"

cd "$PROJECT_DIR"

# Check if docker-compose is running
if ! docker-compose ps | grep -q "pet-adoption-web"; then
    echo "[$(date)] Docker container not running. Skipping backup."
    exit 0
fi

echo "[$(date)] Starting automated backup..."

# Create timestamped backup directory
mkdir -p "$DATED_BACKUP_DIR"

# Dump data
docker-compose exec -T web python manage.py dump_data --output /app/backups/current

# Create a copy with timestamp
cp -r "$BACKUP_DIR/current"/* "$DATED_BACKUP_DIR/"

# Keep only last 7 backups
find "$BACKUP_DIR" -maxdepth 1 -name "backup_*" -type d -mtime +7 -exec rm -rf {} \;

echo "[$(date)] Backup completed. Saved to $DATED_BACKUP_DIR"
