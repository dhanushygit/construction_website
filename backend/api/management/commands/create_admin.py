from django.core.management.base import BaseCommand
from api.models import Admin
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Creates a default admin user'

    def handle(self, *args, **kwargs):
        try:
            admin = Admin.objects.create(
                username='admin',
                password=make_password('admin123'),
                email='admin@example.com'
            )
            self.stdout.write(self.style.SUCCESS('Successfully created admin user'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating admin user: {str(e)}'))
