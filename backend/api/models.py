from django.db import models

# Create your models here.
from django.db import models

class Product_table(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='images/')  # Use an image field

class Admin(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

class Worker(models.Model):
    SERVICE_CHOICES = [
        ('Home Renovation', 'Home Renovation'),
        ('Plumbing Services', 'Plumbing Services'),
        ('Painting & Decoration', 'Painting & Decoration'),
        ('Custom Cabinetry and Carpentry', 'Custom Cabinetry and Carpentry'),
        ('Flooring Installation', 'Flooring Installation'),
        ('Moving Services', 'Moving Services'),
        ('Demolition Services', 'Demolition Services'),
        ('Excavation', 'Excavation'),
        ('Architectural Design', 'Architectural Design'),
        ('Handyman Services', 'Handyman Services'),
        ('Gardening and Lawn Care', 'Gardening and Lawn Care'),
        ('Pool Maintenance', 'Pool Maintenance'),
        ('Home Organization', 'Home Organization'),
        ('Electrical Repairs', 'Electrical Repairs'),
        ('Interior Designs', 'Interior Designs'),
        ('House Cleaning', 'House Cleaning'),
    ]

    name = models.CharField(max_length=200)
    skill = models.CharField(max_length=100, choices=SERVICE_CHOICES)
    experience = models.IntegerField()
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    image = models.ImageField(upload_to='worker_images/', null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    total_ratings = models.IntegerField(default=0)
    bio = models.TextField(blank=True)
    availability = models.BooleanField(default=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Booking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Worker Response'),
        ('ACCEPTED', 'Accepted by Worker'),
        ('REJECTED', 'Rejected by Worker'),
        ('COMPLETED', 'Service Completed'),
        ('CANCELLED', 'Cancelled by Customer'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Payment Pending'),
        ('COMPLETED', 'Payment Completed'),
        ('FAILED', 'Payment Failed'),
    ]

    customer_name = models.CharField(max_length=200, null=True, blank=True)
    customer_email = models.EmailField(null=True, blank=True)
    service_type = models.CharField(max_length=100, null=True, blank=True)
    booking_date = models.DateField(null=True, blank=True)
    message = models.TextField(blank=True, null=True)
    worker = models.ForeignKey(Worker, on_delete=models.SET_NULL, null=True, related_name='bookings')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    worker_response_time = models.DateTimeField(null=True, blank=True)
    worker_notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.customer_name} - {self.service_type} - {self.status}"
