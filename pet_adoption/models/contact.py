from django.db import models

class Contact(models.Model):
    """Model for storing contact form submissions"""
    
    SUBJECT_CHOICES = [
        ('adoption', 'Adoption Inquiry'),
        ('volunteering', 'Volunteering'),
        ('donation', 'Donation Support'),
        ('feedback', 'Feedback'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField()
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES, default='other')
    message = models.TextField()
    
    # Status tracking
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Contact from {self.name} - {self.created_at.strftime('%Y-%m-%d')}"
