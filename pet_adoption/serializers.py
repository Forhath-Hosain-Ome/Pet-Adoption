from rest_framework import serializers
from .models import Pet, Adoption, Contact, Volunteer, Donation, NewsletterSubscription


class PetSerializer(serializers.ModelSerializer):
    """Serializer for Pet model with all fields"""
    
    class Meta:
        model = Pet
        fields = [
            'id', 'name', 'pet_type', 'breed', 'age', 'gender',
            'is_vaccinated', 'is_neutered_spayed', 'health_status',
            'status', 'description', 'image', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PetListSerializer(serializers.ModelSerializer):
    """Serializer for Pet list view - limited fields for performance"""
    
    class Meta:
        model = Pet
        fields = [
            'id', 'name', 'pet_type', 'age', 'gender',
            'status', 'image'
        ]


class AdoptionSerializer(serializers.ModelSerializer):
    """Serializer for Adoption model with nested Pet data"""
    pet_details = PetListSerializer(source='pet', read_only=True)
    
    class Meta:
        model = Adoption
        fields = [
            'id', 'adopter_name', 'adopter_email', 'adopter_phone',
            'pet', 'pet_details', 'status', 'reason_for_adoption',
            'home_type', 'other_pets', 'applied_at', 'approved_at',
            'completed_at', 'updated_at'
        ]
        read_only_fields = ['id', 'applied_at', 'approved_at', 'completed_at', 'updated_at']


class AdoptionListSerializer(serializers.ModelSerializer):
    """Serializer for Adoption list view - limited fields"""
    pet_name = serializers.CharField(source='pet.name', read_only=True)
    pet_type = serializers.CharField(source='pet.pet_type', read_only=True)
    
    class Meta:
        model = Adoption
        fields = [
            'id', 'adopter_name', 'pet', 'pet_name', 'pet_type',
            'status', 'applied_at'
        ]


class ContactSerializer(serializers.ModelSerializer):
    """Serializer for Contact form submissions"""
    
    class Meta:
        model = Contact
        fields = [
            'id', 'name', 'phone', 'email', 'subject', 'message',
            'is_read', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VolunteerSerializer(serializers.ModelSerializer):
    """Serializer for Volunteer model"""
    
    class Meta:
        model = Volunteer
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 'roles',
            'weekly_hours', 'experience', 'motivation', 'status',
            'applied_at', 'updated_at'
        ]
        read_only_fields = ['id', 'applied_at', 'updated_at']


class VolunteerListSerializer(serializers.ModelSerializer):
    """Serializer for Volunteer list view"""
    
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Volunteer
        fields = [
            'id', 'full_name', 'email', 'status', 'applied_at'
        ]
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class DonationSerializer(serializers.ModelSerializer):
    """Serializer for Donation model"""
    
    class Meta:
        model = Donation
        fields = [
            'id', 'donor_name', 'donor_email', 'amount',
            'is_custom', 'is_anonymous', 'payment_status', 'transaction_id',
            'message', 'created_at', 'completed_at'
        ]
        read_only_fields = ['id', 'created_at', 'completed_at']


class DonationListSerializer(serializers.ModelSerializer):
    """Serializer for Donation list view"""
    
    class Meta:
        model = Donation
        fields = [
            'id', 'amount', 'donor_name', 'payment_status', 'created_at'
        ]


class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for Newsletter Subscription"""
    
    class Meta:
        model = NewsletterSubscription
        fields = [
            'id', 'email', 'subscribed_at', 'is_active'
        ]
        read_only_fields = ['id', 'subscribed_at']
