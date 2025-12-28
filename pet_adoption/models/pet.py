from django.db import models

class Pet(models.Model):
    """Model representing a pet available for adoption"""
    
    PET_TYPE_CHOICES = [
        ('dog', 'Dog'),
        ('cat', 'Cat'),
        ('rabbit', 'Rabbit'),
        ('bird', 'Bird'),
    ]
    
    AGE_CHOICES = [
        ('baby', 'Baby'),
        ('young', 'Young'),
        ('adult', 'Adult'),
    ]
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('adopted', 'Adopted'),
        ('pending', 'Pending'),
    ]
    
    # Basic Information
    name = models.CharField(max_length=100)
    pet_type = models.CharField(max_length=20, choices=PET_TYPE_CHOICES)
    breed = models.CharField(max_length=100, blank=True, null=True)
    age = models.CharField(max_length=20, choices=AGE_CHOICES)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    
    # Medical Information
    is_vaccinated = models.BooleanField(default=False)
    is_neutered_spayed = models.BooleanField(default=False)
    health_status = models.CharField(max_length=500, blank=True, null=True)
    
    # Adoption Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    # Description
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='pets/', blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Pets"
    
    def __str__(self):
        return f"{self.name} ({self.get_pet_type_display()})"
