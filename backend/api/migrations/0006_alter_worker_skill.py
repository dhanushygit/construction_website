# Generated by Django 5.0.3 on 2025-02-14 04:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_booking_customer_email_booking_message_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='worker',
            name='skill',
            field=models.CharField(choices=[('Home Renovation', 'Home Renovation'), ('Plumbing Services', 'Plumbing Services'), ('Painting & Decoration', 'Painting & Decoration'), ('Custom Cabinetry and Carpentry', 'Custom Cabinetry and Carpentry'), ('Flooring Installation', 'Flooring Installation'), ('Moving Services', 'Moving Services'), ('Demolition Services', 'Demolition Services'), ('Excavation', 'Excavation'), ('Architectural Design', 'Architectural Design'), ('Handyman Services', 'Handyman Services'), ('Gardening and Lawn Care', 'Gardening and Lawn Care'), ('Pool Maintenance', 'Pool Maintenance'), ('Home Organization', 'Home Organization'), ('Electrical Repairs', 'Electrical Repairs'), ('Interior Designs', 'Interior Designs'), ('House Cleaning', 'House Cleaning')], max_length=100),
        ),
    ]
