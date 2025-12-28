from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import render
from .models import Pet, Adoption, Contact, Volunteer, Donation, NewsletterSubscription
from .serializers import (
    PetSerializer, PetListSerializer,
    AdoptionSerializer, AdoptionListSerializer,
    ContactSerializer,
    VolunteerSerializer, VolunteerListSerializer,
    DonationSerializer, DonationListSerializer,
    NewsletterSubscriptionSerializer
)


class StandardResultsSetPagination(PageNumberPagination):
    """Standard pagination for list views"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class PetViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Pet model.
    
    Features:
    - List all available pets with filters
    - Filter by type, age, gender, status
    - Search by name
    - Create/Update/Delete pets (admin only)
    - Retrieve single pet details
    """
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['pet_type', 'age', 'gender', 'status']
    search_fields = ['name', 'breed', 'description']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use list serializer for list view"""
        if self.action == 'list':
            return PetListSerializer
        return PetSerializer
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get all available pets"""
        available_pets = Pet.objects.filter(status='available')
        page = self.paginate_queryset(available_pets)
        if page is not None:
            serializer = PetListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PetListSerializer(available_pets, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def adopted(self, request):
        """Get all adopted pets"""
        adopted_pets = Pet.objects.filter(status='adopted')
        page = self.paginate_queryset(adopted_pets)
        if page is not None:
            serializer = PetListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PetListSerializer(adopted_pets, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_adopted(self, request, pk=None):
        """Mark a pet as adopted"""
        pet = self.get_object()
        pet.status = 'adopted'
        pet.save()
        return Response(
            {'status': 'Pet marked as adopted'},
            status=status.HTTP_200_OK
        )


class AdoptionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Adoption applications.
    
    Features:
    - List all adoption applications
    - Filter by status
    - Create new adoption applications
    - View adoption details
    - Admin can approve/reject applications
    """
    queryset = Adoption.objects.all()
    serializer_class = AdoptionSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'pet_id']
    ordering_fields = ['applied_at', 'status']
    ordering = ['-applied_at']
    
    def get_serializer_class(self):
        """Use list serializer for list view"""
        if self.action == 'list':
            return AdoptionListSerializer
        return AdoptionSerializer
    
    def perform_create(self, serializer):
        """Create adoption application"""
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get all pending adoption applications"""
        pending_apps = Adoption.objects.filter(status='pending')
        page = self.paginate_queryset(pending_apps)
        if page is not None:
            serializer = AdoptionListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = AdoptionListSerializer(pending_apps, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve an adoption application"""
        adoption = self.get_object()
        adoption.status = 'approved'
        adoption.approved_at = None  # Will be set by save
        adoption.save()
        
        # Update pet status to pending
        adoption.pet.status = 'pending'
        adoption.pet.save()
        
        return Response(
            {'status': 'Adoption application approved'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject an adoption application"""
        adoption = self.get_object()
        adoption.status = 'rejected'
        adoption.save()
        return Response(
            {'status': 'Adoption application rejected'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete an adoption"""
        adoption = self.get_object()
        adoption.status = 'completed'
        adoption.completed_at = None  # Will be set by save
        adoption.save()
        
        # Update pet status to adopted
        adoption.pet.status = 'adopted'
        adoption.pet.save()
        
        return Response(
            {'status': 'Adoption completed'},
            status=status.HTTP_200_OK
        )


class ContactViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Contact form submissions.
    
    Features:
    - Create new contact submissions
    - List all contacts (admin only)
    - Mark contacts as read
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_read']
    search_fields = ['name', 'email', 'message']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a contact message as read"""
        contact = self.get_object()
        contact.is_read = True
        contact.save()
        return Response(
            {'status': 'Message marked as read'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get all unread contact messages"""
        unread_contacts = Contact.objects.filter(is_read=False)
        page = self.paginate_queryset(unread_contacts)
        if page is not None:
            serializer = ContactSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ContactSerializer(unread_contacts, many=True)
        return Response(serializer.data)


class VolunteerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Volunteer applications.
    
    Features:
    - List volunteer applications
    - Create volunteer applications
    - Admin can approve/reject volunteers
    - Filter by status and interest
    """
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'interest']
    search_fields = ['name', 'email']
    ordering_fields = ['applied_at', 'status']
    ordering = ['-applied_at']
    
    def get_serializer_class(self):
        """Use list serializer for list view"""
        if self.action == 'list':
            return VolunteerListSerializer
        return VolunteerSerializer
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get all pending volunteer applications"""
        pending_volunteers = Volunteer.objects.filter(status='pending')
        page = self.paginate_queryset(pending_volunteers)
        if page is not None:
            serializer = VolunteerListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = VolunteerListSerializer(pending_volunteers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def approved(self, request):
        """Get all approved volunteers"""
        approved_volunteers = Volunteer.objects.filter(status='approved')
        page = self.paginate_queryset(approved_volunteers)
        if page is not None:
            serializer = VolunteerListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = VolunteerListSerializer(approved_volunteers, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a volunteer application"""
        volunteer = self.get_object()
        volunteer.status = 'approved'
        volunteer.save()
        return Response(
            {'status': 'Volunteer approved'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a volunteer application"""
        volunteer = self.get_object()
        volunteer.status = 'rejected'
        volunteer.save()
        return Response(
            {'status': 'Volunteer rejected'},
            status=status.HTTP_200_OK
        )


class DonationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Donations.
    
    Features:
    - Create donations
    - List donations with payment status
    - Filter by payment status
    - Get donation statistics
    """
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['payment_status']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use list serializer for list view"""
        if self.action == 'list':
            return DonationListSerializer
        return DonationSerializer
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get donation statistics"""
        from django.db.models import Sum, Count, Avg
        
        stats = Donation.objects.filter(
            payment_status='completed'
        ).aggregate(
            total_amount=Sum('amount'),
            total_donations=Count('id'),
            average_amount=Avg('amount')
        )
        
        return Response({
            'total_amount': stats['total_amount'] or 0,
            'total_donations': stats['total_donations'] or 0,
            'average_amount': stats['average_amount'] or 0,
            'currency': 'USD'
        })
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        """Get all completed donations"""
        completed_donations = Donation.objects.filter(payment_status='completed')
        page = self.paginate_queryset(completed_donations)
        if page is not None:
            serializer = DonationListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = DonationListSerializer(completed_donations, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        """Mark donation as completed"""
        donation = self.get_object()
        donation.payment_status = 'completed'
        donation.completed_at = None  # Will be set by model
        donation.save()
        return Response(
            {'status': 'Donation marked as completed'},
            status=status.HTTP_200_OK
        )


class NewsletterSubscriptionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Newsletter Subscriptions.
    
    Features:
    - Subscribe to newsletter
    - Manage subscriptions
    - Unsubscribe from newsletter
    - List all subscribers (admin only)
    """
    queryset = NewsletterSubscription.objects.all()
    serializer_class = NewsletterSubscriptionSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['email']
    ordering_fields = ['subscribed_at']
    ordering = ['-subscribed_at']
    
    def create(self, request, *args, **kwargs):
        """Override create to prevent duplicate subscriptions"""
        email = request.data.get('email')
        
        # Check if email already exists
        existing = NewsletterSubscription.objects.filter(email=email).first()
        if existing:
            if not existing.is_active:
                # Reactivate subscription
                existing.is_active = True
                existing.save()
                return Response(
                    NewsletterSubscriptionSerializer(existing).data,
                    status=status.HTTP_200_OK
                )
            return Response(
                {'detail': 'Email already subscribed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def unsubscribe(self, request, pk=None):
        """Unsubscribe from newsletter"""
        subscription = self.get_object()
        subscription.is_active = False
        subscription.save()
        return Response(
            {'status': 'Successfully unsubscribed'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active subscriptions"""
        active_subs = NewsletterSubscription.objects.filter(is_active=True)
        page = self.paginate_queryset(active_subs)
        if page is not None:
            serializer = NewsletterSubscriptionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = NewsletterSubscriptionSerializer(active_subs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def count(self, request):
        """Get count of active subscribers"""
        active_count = NewsletterSubscription.objects.filter(is_active=True).count()
        return Response({
            'active_subscribers': active_count,
            'total_subscribers': NewsletterSubscription.objects.count()
        })

# ===================================
# Page Views (for rendering templates)
# ===================================

def index(request):
    """Homepage view"""
    pets = Pet.objects.filter(status='available')[:6]
    context = {
        'pets': pets,
    }
    return render(request, 'index.html', context)


def contact(request):
    """Contact page view"""
    context = {}
    return render(request, 'contact.html', context)