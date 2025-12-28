from django.db import models

class NewsletterSubscription(models.Model):
    """Model for newsletter email subscriptions"""
    
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-subscribed_at']
    
    def __str__(self):
        return f"{self.email} (Active: {self.is_active})"
