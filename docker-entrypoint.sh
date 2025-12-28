#!/bin/bash
# Entrypoint script for Docker container

set -e

echo "Starting Pet Adoption application..."

# Run migrations
echo "Running migrations..."
python manage.py migrate

# Check if backups directory exists and has data
if [ -d "/app/backups" ] && [ "$(ls -A /app/backups/*.json 2>/dev/null)" ]; then
    echo "Loading data from backups..."
    python manage.py load_data --input /app/backups
else
    echo "No backup files found. Starting with empty database."
fi

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Application ready!"

# Execute the main command
exec "$@"
