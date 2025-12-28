from django.db import models

class Donation(models.Model):
    """Model for tracking donations"""
    
    AMOUNT_CHOICES = [
        (25, '$25'),
        (50, '$50'),
        (100, '$100'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    donor_name = models.CharField(max_length=100, blank=True, null=True)
    donor_email = models.EmailField(blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Predefined or custom
    is_custom = models.BooleanField(default=False)
    
    # Payment tracking
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=200, blank=True, null=True, unique=True)
    
    # Optional message
    message = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Donation of ${self.amount} - {self.payment_status}"
