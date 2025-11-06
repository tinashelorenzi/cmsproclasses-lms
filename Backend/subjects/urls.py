from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SubjectViewSet,
    AnnouncementViewSet,
    MaterialViewSet,
    SubjectEnrollmentViewSet
)

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'subjects', SubjectViewSet, basename='subject')
router.register(r'announcements', AnnouncementViewSet, basename='announcement')
router.register(r'materials', MaterialViewSet, basename='material')
router.register(r'enrollments', SubjectEnrollmentViewSet, basename='enrollment')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
]