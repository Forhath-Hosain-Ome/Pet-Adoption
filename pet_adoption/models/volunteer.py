from django.db import models

class Volunteer(models.Model):
    """Model for volunteer applications and registrations"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    # Personal information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    # Roles as text field (stores comma-separated values)
    roles = models.TextField(blank=True, null=True, help_text="Comma-separated list of selected roles")
    
    # Availability
    weekly_hours = models.CharField(max_length=100, blank=True, null=True, help_text="e.g., 2-5, 5-10, 10+")
    
    # Background info
    experience = models.TextField(blank=True, null=True)
    motivation = models.TextField(blank=True, null=True)
    
    # Application status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Timestamps
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - ({self.status})"
