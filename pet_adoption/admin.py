from django.contrib import admin
from .models import Pet, Adoption, Contact, Volunteer, Donation, NewsletterSubscription


@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    """Admin interface for Pet model"""
    list_display = ['name', 'pet_type', 'age', 'gender', 'status', 'is_vaccinated', 'is_neutered_spayed']
    list_filter = ['pet_type', 'age', 'gender', 'status', 'is_vaccinated', 'is_neutered_spayed', 'created_at']
    search_fields = ['name', 'breed', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'pet_type', 'breed', 'age', 'gender')
        }),
        ('Medical Information', {
            'fields': ('is_vaccinated', 'is_neutered_spayed', 'health_status')
        }),
        ('Details', {
            'fields': ('description', 'image', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['mark_as_available', 'mark_as_adopted']
    
    def mark_as_available(self, request, queryset):
        queryset.update(status='available')
    mark_as_available.short_description = 'Mark selected pets as Available'
    
    def mark_as_adopted(self, request, queryset):
        queryset.update(status='adopted')
    mark_as_adopted.short_description = 'Mark selected pets as Adopted'


@admin.register(Adoption)
class AdoptionAdmin(admin.ModelAdmin):
    """Admin interface for Adoption model"""
    list_display = ['adopter_name', 'pet', 'status', 'applied_at', 'approved_at']
    list_filter = ['status', 'applied_at', 'pet__pet_type']
    search_fields = ['adopter_name', 'adopter_email', 'pet__name']
    readonly_fields = ['applied_at', 'approved_at', 'completed_at', 'updated_at']
    fieldsets = (
        ('Adopter Information', {
            'fields': ('adopter_name', 'adopter_email', 'adopter_phone')
        }),
        ('Pet', {
            'fields': ('pet',)
        }),
        ('Application Details', {
            'fields': ('reason_for_adoption', 'home_type', 'other_pets')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('applied_at', 'approved_at', 'completed_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['approve_adoption', 'reject_adoption', 'complete_adoption']
    
    def approve_adoption(self, request, queryset):
        queryset.update(status='approved')
    approve_adoption.short_description = 'Approve selected adoptions'
    
    def reject_adoption(self, request, queryset):
        queryset.update(status='rejected')
    reject_adoption.short_description = 'Reject selected adoptions'
    
    def complete_adoption(self, request, queryset):
        queryset.update(status='completed')
    complete_adoption.short_description = 'Complete selected adoptions'


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    """Admin interface for Contact model"""
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'subject', 'created_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Sender Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Message', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('is_read',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = 'Mark selected as read'
    
    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
    mark_as_unread.short_description = 'Mark selected as unread'


@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    """Admin interface for Volunteer model"""
    list_display = ['first_name', 'last_name', 'email', 'status', 'applied_at']
    list_filter = ['status', 'applied_at']
    search_fields = ['first_name', 'last_name', 'email', 'experience']
    readonly_fields = ['applied_at', 'updated_at']
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        ('Volunteer Details', {
            'fields': ('roles', 'weekly_hours', 'experience', 'motivation')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('applied_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['approve_volunteer', 'reject_volunteer']
    
    def approve_volunteer(self, request, queryset):
        queryset.update(status='approved')
    approve_volunteer.short_description = 'Approve selected volunteers'
    
    def reject_volunteer(self, request, queryset):
        queryset.update(status='rejected')
    reject_volunteer.short_description = 'Reject selected volunteers'


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    """Admin interface for Donation model"""
    list_display = ['amount', 'donor_name', 'payment_status', 'created_at']
    list_filter = ['payment_status', 'created_at', 'is_custom', 'is_anonymous']
    search_fields = ['donor_name', 'donor_email', 'transaction_id']
    readonly_fields = ['created_at', 'completed_at']
    fieldsets = (
        ('Donor Information', {
            'fields': ('donor_name', 'donor_email', 'is_anonymous')
        }),
        ('Donation Details', {
            'fields': ('amount', 'is_custom', 'message')
        }),
        ('Payment Information', {
            'fields': ('payment_status', 'transaction_id')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['mark_as_completed', 'mark_as_failed']
    
    def mark_as_completed(self, request, queryset):
        queryset.update(payment_status='completed')
    mark_as_completed.short_description = 'Mark as Completed'
    
    def mark_as_failed(self, request, queryset):
        queryset.update(payment_status='failed')
    mark_as_failed.short_description = 'Mark as Failed'


@admin.register(NewsletterSubscription)
class NewsletterSubscriptionAdmin(admin.ModelAdmin):
    """Admin interface for Newsletter Subscription model"""
    list_display = ['email', 'is_active', 'subscribed_at']
    list_filter = ['is_active', 'subscribed_at']
    search_fields = ['email']
    readonly_fields = ['subscribed_at']
    fieldsets = (
        ('Subscription', {
            'fields': ('email', 'is_active', 'subscribed_at')
        }),
    )
    actions = ['activate_subscription', 'deactivate_subscription']
    
    def activate_subscription(self, request, queryset):
        queryset.update(is_active=True)
    activate_subscription.short_description = 'Activate subscriptions'
    
    def deactivate_subscription(self, request, queryset):
        queryset.update(is_active=False)
    deactivate_subscription.short_description = 'Deactivate subscriptions'

