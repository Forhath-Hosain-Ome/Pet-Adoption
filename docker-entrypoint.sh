#!/bin/bash
# Entrypoint script for Docker container

set -e

echo "Starting Pet Adoption application..."

# Run migrations
echo "Running migrations..."
python manage.py migrate

# Create superuser if not exists
echo "Setting up admin user..."
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@localhost', 'admin')
    print('✓ Superuser created: admin / admin')
else:
    print('✓ Superuser already exists')
END

# Check if backups directory exists and has data
if [ -d "/app/backups" ] && [ "$(ls -A /app/backups/*.json 2>/dev/null)" ]; then
    echo "Loading data from backups..."
    python manage.py load_data --input /app/backups
else
    echo "No backup files found. Starting with empty database."
fi

echo "Application ready!"

# Execute the main command
exec "$@"
