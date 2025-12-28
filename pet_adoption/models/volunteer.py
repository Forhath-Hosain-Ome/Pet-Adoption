from django.db import models

class Volunteer(models.Model):
    """Model for volunteer applications and registrations"""
    
    INTEREST_CHOICES = [
        ('care', 'Animal Care'),
        ('events', 'Events Management'),
        ('admin', 'Administrative Support'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    interest = models.CharField(max_length=50, choices=INTEREST_CHOICES)
    
    # Application status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Additional info
    bio = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    availability = models.CharField(max_length=200, blank=True, null=True)
    
    # Timestamps
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.name} - {self.get_interest_display()} ({self.status})"
