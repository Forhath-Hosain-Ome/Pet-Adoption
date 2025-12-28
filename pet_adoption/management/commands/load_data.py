import json
import os
from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = 'Load data from JSON backup files into database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--input',
            type=str,
            default='/app/backups',
            help='Input directory for backup files'
        )
        parser.add_argument(
            '--files',
            type=str,
            default=None,
            help='Specific files to load (comma-separated, e.g., "pet.json,adoption.json")'
        )

    def handle(self, *args, **options):
        input_dir = options['input']
        
        # Check if backup directory exists
        if not os.path.exists(input_dir):
            self.stdout.write(
                self.style.WARNING(f'Backup directory {input_dir} does not exist. Skipping data load.')
            )
            return
        
        files_to_load = []
        
        if options['files']:
            # Load specific files
            files_to_load = options['files'].split(',')
            files_to_load = [f.strip() for f in files_to_load]
        else:
            # Get all JSON files except manifest
            for filename in sorted(os.listdir(input_dir)):
                if filename.endswith('.json') and filename != 'manifest.json':
                    files_to_load.append(filename)
        
        # Load each JSON file
        loaded_count = 0
        for filename in files_to_load:
            filepath = os.path.join(input_dir, filename)
            
            if not os.path.exists(filepath):
                self.stdout.write(
                    self.style.WARNING(f'File {filepath} not found. Skipping.')
                )
                continue
            
            try:
                # Check if file is empty
                with open(filepath, 'r') as f:
                    data = json.load(f)
                
                if not data:
                    self.stdout.write(
                        self.style.WARNING(f'{filename} is empty. Skipping.')
                    )
                    continue
                
                self.stdout.write(f'Loading data from {filename}...')
                
                # Use Django's loaddata command
                call_command(
                    'loaddata',
                    filepath,
                    verbosity=1
                )
                
                loaded_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully loaded {filename}')
                )
            except json.JSONDecodeError as e:
                self.stdout.write(
                    self.style.ERROR(f'JSON decode error in {filename}: {str(e)}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Failed to load {filename}: {str(e)}')
                )
        
        if loaded_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f'\nSuccessfully loaded {loaded_count} file(s)')
            )
        else:
            self.stdout.write(
                self.style.WARNING('\nNo data files were loaded')
            )
