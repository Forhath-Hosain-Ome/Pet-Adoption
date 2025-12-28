# Backups Directory

This directory stores JSON backup files for the Pet Adoption database.

## Structure

- `pet.json` - Pet model data
- `adoption.json` - Adoption model data
- `contact.json` - Contact model data
- `donation.json` - Donation model data
- `newsletter.json` - Newsletter model data
- `volunteer.json` - Volunteer model data
- `manifest.json` - Backup metadata

## How It Works

### Automatic Loading
On `docker-compose up`, if this directory contains JSON files, they will automatically load into the database.

### Manual Backup
```bash
# From host
docker-compose exec web python manage.py dump_data --output /app/backups

# Or using script
./backup.sh backups
```

### Manual Restore
```bash
# From host
docker-compose exec web python manage.py load_data --input /app/backups

# Or using script
./restore.sh backups
```

## Data Persistence Workflow

1. **During Session**: Database operates normally with SQLite
2. **Before Shutdown**: Run backup to save as JSON
3. **On Restart**: JSON files are automatically loaded into fresh database

## Important Notes

- JSON files are human-readable and version-control friendly
- Store backups before destroying containers: `docker-compose down -v`
- SQLite data is lost when containers are removed, but JSON backups persist
- Keep backups directory in your git repo (or use .gitignore as needed)
