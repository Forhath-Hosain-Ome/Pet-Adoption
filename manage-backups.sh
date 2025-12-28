#!/bin/bash
# Complete backup and restore workflow script

set -e

PROJECT_DIR="/home/dev_f/basic/Pet-Adoption"
cd "$PROJECT_DIR"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

usage() {
    echo "Usage: $0 {backup|restore|status|schedule|unschedule}"
    echo ""
    echo "Commands:"
    echo "  backup      - Dump current database to JSON"
    echo "  restore     - Load database from JSON backup"
    echo "  status      - Show backup status"
    echo "  schedule    - Setup daily automated backups (cron)"
    echo "  unschedule  - Remove automated backups (cron)"
    exit 1
}

backup() {
    echo -e "${BLUE}Starting database backup...${NC}"
    
    if ! docker-compose ps | grep -q "pet-adoption-web"; then
        echo -e "${RED}Error: Docker container is not running${NC}"
        exit 1
    fi
    
    docker-compose exec -T web python manage.py dump_data --output /app/backups/current
    
    echo -e "${GREEN}Backup completed successfully!${NC}"
    echo -e "${YELLOW}Backup location: ./backups/current/${NC}"
    ls -lh ./backups/current/*.json
}

restore() {
    echo -e "${YELLOW}Warning: This will overwrite the current database${NC}"
    read -p "Continue? (y/N) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Loading database from backup...${NC}"
        
        if ! docker-compose ps | grep -q "pet-adoption-web"; then
            echo -e "${RED}Error: Docker container is not running${NC}"
            exit 1
        fi
        
        docker-compose exec -T web python manage.py load_data --input /app/backups/current
        
        echo -e "${GREEN}Restore completed successfully!${NC}"
    else
        echo -e "${YELLOW}Restore cancelled${NC}"
    fi
}

status() {
    echo -e "${BLUE}Backup Status${NC}"
    echo "================================"
    
    if [ -d "./backups/current" ]; then
        echo -e "${GREEN}Latest backup files:${NC}"
        ls -lh ./backups/current/*.json 2>/dev/null || echo "No backup files found"
        echo ""
        echo -e "${GREEN}Total backup size:${NC}"
        du -sh ./backups/current 2>/dev/null || echo "N/A"
    else
        echo -e "${YELLOW}No backups found${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}Backup History:${NC}"
    ls -ldt ./backups/backup_*/ 2>/dev/null | head -5 || echo "No backup history"
}

schedule() {
    SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/auto-backup.sh"
    
    # Check if already scheduled
    if crontab -l 2>/dev/null | grep -q "$SCRIPT_PATH"; then
        echo -e "${YELLOW}Backup already scheduled${NC}"
        return
    fi
    
    # Create crontab entry (daily at 2 AM)
    (crontab -l 2>/dev/null; echo "0 2 * * * $SCRIPT_PATH") | crontab -
    
    echo -e "${GREEN}Daily backup scheduled${NC}"
    echo "Time: 02:00 every day"
    echo "Script: $SCRIPT_PATH"
    echo ""
    echo -e "${YELLOW}Current cron jobs:${NC}"
    crontab -l | grep auto-backup.sh
}

unschedule() {
    SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/auto-backup.sh"
    
    if ! crontab -l 2>/dev/null | grep -q "$SCRIPT_PATH"; then
        echo -e "${YELLOW}No scheduled backup found${NC}"
        return
    fi
    
    crontab -l 2>/dev/null | grep -v "$SCRIPT_PATH" | crontab -
    
    echo -e "${GREEN}Scheduled backup removed${NC}"
}

[ $# -eq 0 ] && usage

case "$1" in
    backup)
        backup
        ;;
    restore)
        restore
        ;;
    status)
        status
        ;;
    schedule)
        schedule
        ;;
    unschedule)
        unschedule
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        usage
        ;;
esac
