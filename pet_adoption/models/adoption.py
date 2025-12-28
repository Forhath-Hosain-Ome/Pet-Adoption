from django.db import models
from .pet import Pet

class Adoption(models.Model):
    """Model for tracking pet adoptions"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]
    
    # Adopter Information
    adopter_name = models.CharField(max_length=100)
    adopter_email = models.EmailField()
    adopter_phone = models.CharField(max_length=20)
    
    # Pet Information
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='adoptions')
    
    # Adoption Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Additional info
    reason_for_adoption = models.TextField(blank=True, null=True)
    home_type = models.CharField(max_length=100, blank=True, null=True)
    other_pets = models.CharField(max_length=200, blank=True, null=True)
    
    # Timestamps
    applied_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.adopter_name} adopting {self.pet.name} - {self.status}"
