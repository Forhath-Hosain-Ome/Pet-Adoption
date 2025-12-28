import json
import os
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.apps import apps


class Command(BaseCommand):
    help = 'Dump all database data to JSON backup files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            type=str,
            default='/app/backups',
            help='Output directory for backup files'
        )
        parser.add_argument(
            '--models',
            type=str,
            default=None,
            help='Specific models to dump (comma-separated, e.g., "pet_adoption.Pet,pet_adoption.Adoption")'
        )

    def handle(self, *args, **options):
        output_dir = options['output']
        
        # Create backup directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        models_to_dump = []
        
        if options['models']:
            # Dump specific models
            models_to_dump = options['models'].split(',')
            models_to_dump = [model.strip() for model in models_to_dump]
        else:
            # Get all models from pet_adoption app
            pet_adoption_app = apps.get_app_config('pet_adoption')
            for model in pet_adoption_app.get_models():
                models_to_dump.append(f"{model._meta.app_label}.{model._meta.object_name}")
        
        # Dump each model to a separate JSON file
        for model_label in models_to_dump:
            try:
                output_file = os.path.join(output_dir, f"{model_label.split('.')[-1].lower()}.json")
                
                self.stdout.write(f'Dumping {model_label} to {output_file}...')
                
                # Use Django's dumpdata command
                call_command(
                    'dumpdata',
                    model_label,
                    stdout=open(output_file, 'w'),
                    indent=2,
                    format='json'
                )
                
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully dumped {model_label}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Failed to dump {model_label}: {str(e)}')
                )
        
        # Create a manifest file
        manifest_file = os.path.join(output_dir, 'manifest.json')
        manifest = {
            'models': models_to_dump,
            'timestamp': str(os.path.getmtime(output_dir))
        }
        
        with open(manifest_file, 'w') as f:
            json.dump(manifest, f, indent=2)
        
        self.stdout.write(self.style.SUCCESS(f'\nBackup completed! Files saved to {output_dir}'))
