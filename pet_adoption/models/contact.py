from django.db import models

class Contact(models.Model):
    """Model for storing contact form submissions"""
    
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    message = models.TextField()
    
    # Status tracking
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Contact from {self.name} - {self.created_at.strftime('%Y-%m-%d')}"
