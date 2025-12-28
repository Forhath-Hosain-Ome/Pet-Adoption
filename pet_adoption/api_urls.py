from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PetViewSet, AdoptionViewSet, ContactViewSet,
    VolunteerViewSet, DonationViewSet, NewsletterSubscriptionViewSet
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'pets', PetViewSet, basename='pet')
router.register(r'adoptions', AdoptionViewSet, basename='adoption')
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'volunteers', VolunteerViewSet, basename='volunteer')
router.register(r'donations', DonationViewSet, basename='donation')
router.register(r'newsletter', NewsletterSubscriptionViewSet, basename='newsletter')

app_name = 'pet_adoption'

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
