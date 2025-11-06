from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Subject, SubjectEnrollment, Announcement, Material
from .serializers import (
    SubjectListSerializer,
    SubjectDetailSerializer,
    SubjectEnrollmentSerializer,
    AnnouncementSerializer,
    MaterialSerializer,
    ReorderSerializer
)
from .permissions import IsTutorOrReadOnly, IsTutorOfSubject, IsEnrolledStudent


class SubjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Subject CRUD operations
    
    - List: All active subjects (or subjects user is enrolled in for students)
    - Create: Tutors only
    - Update/Delete: Subject tutor only
    - Retrieve: Anyone enrolled or tutor
    """
    permission_classes = [permissions.IsAuthenticated, IsTutorOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SubjectListSerializer
        return SubjectDetailSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Subject.objects.select_related('tutor').prefetch_related(
            'announcements', 'materials', 'enrollments'
        )
        
        # Tutors see subjects they teach
        if user.user_type == 'TUTOR':
            return queryset.filter(tutor=user)
        
        # Students see subjects they're enrolled in
        elif user.user_type == 'STUDENT':
            return queryset.filter(
                enrollments__student=user,
                enrollments__is_active=True
            )
        
        # Parents see subjects their children are enrolled in
        elif user.user_type == 'PARENT':
            # Assuming a parent-child relationship exists
            children = user.children.all()  # You'll need to define this relationship
            return queryset.filter(
                enrollments__student__in=children,
                enrollments__is_active=True
            ).distinct()
        
        return queryset.filter(is_active=True)
    
    def perform_create(self, serializer):
        # Only tutors can create subjects
        serializer.save(tutor=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def enroll(self, request, pk=None):
        """
        Enroll current user (student) in this subject
        """
        subject = self.get_object()
        user = request.user
        
        if user.user_type != 'STUDENT':
            return Response(
                {'error': 'Only students can enroll in subjects'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if already enrolled
        enrollment, created = SubjectEnrollment.objects.get_or_create(
            student=user,
            subject=subject,
            defaults={'is_active': True}
        )
        
        if not created:
            if enrollment.is_active:
                return Response(
                    {'message': 'Already enrolled in this subject'},
                    status=status.HTTP_200_OK
                )
            else:
                # Reactivate enrollment
                enrollment.is_active = True
                enrollment.save()
                return Response(
                    {'message': 'Re-enrolled in subject'},
                    status=status.HTTP_200_OK
                )
        
        serializer = SubjectEnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unenroll(self, request, pk=None):
        """
        Unenroll current user (student) from this subject
        """
        subject = self.get_object()
        user = request.user
        
        if user.user_type != 'STUDENT':
            return Response(
                {'error': 'Only students can unenroll from subjects'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            enrollment = SubjectEnrollment.objects.get(
                student=user,
                subject=subject,
                is_active=True
            )
            enrollment.is_active = False
            enrollment.save()
            return Response(
                {'message': 'Successfully unenrolled from subject'},
                status=status.HTTP_200_OK
            )
        except SubjectEnrollment.DoesNotExist:
            return Response(
                {'error': 'Not enrolled in this subject'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        """
        Get list of students enrolled in this subject
        Only accessible by the subject tutor
        """
        subject = self.get_object()
        
        # Check if user is the tutor of this subject
        if request.user.user_type != 'TUTOR' or subject.tutor != request.user:
            return Response(
                {'error': 'Only the subject tutor can view enrolled students'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        enrollments = SubjectEnrollment.objects.filter(
            subject=subject,
            is_active=True
        ).select_related('student')
        
        serializer = SubjectEnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)


class AnnouncementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Announcement CRUD operations
    
    - Create/Update/Delete: Subject tutor only
    - List/Retrieve: Enrolled students and tutor
    """
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Tutors see announcements for their subjects
        if user.user_type == 'TUTOR':
            return Announcement.objects.filter(subject__tutor=user)
        
        # Students see announcements for subjects they're enrolled in
        elif user.user_type == 'STUDENT':
            return Announcement.objects.filter(
                subject__enrollments__student=user,
                subject__enrollments__is_active=True
            )
        
        return Announcement.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['post'], url_path='reorder')
    def reorder(self, request):
        """
        Reorder announcements
        Expects: [{'item_id': 1, 'new_order': 0}, {'item_id': 2, 'new_order': 1}, ...]
        """
        serializer = ReorderSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        
        for item in serializer.validated_data:
            try:
                announcement = Announcement.objects.get(
                    id=item['item_id'],
                    subject__tutor=request.user
                )
                announcement.order = item['new_order']
                announcement.save()
            except Announcement.DoesNotExist:
                pass
        
        return Response({'message': 'Announcements reordered successfully'})


class MaterialViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Material CRUD operations
    
    - Create/Update/Delete: Subject tutor only
    - List/Retrieve: Enrolled students and tutor
    """
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Tutors see materials for their subjects
        if user.user_type == 'TUTOR':
            return Material.objects.filter(subject__tutor=user)
        
        # Students see materials for subjects they're enrolled in
        elif user.user_type == 'STUDENT':
            return Material.objects.filter(
                subject__enrollments__student=user,
                subject__enrollments__is_active=True
            )
        
        return Material.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['post'], url_path='reorder')
    def reorder(self, request):
        """
        Reorder materials
        Expects: [{'item_id': 1, 'new_order': 0}, {'item_id': 2, 'new_order': 1}, ...]
        """
        serializer = ReorderSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        
        for item in serializer.validated_data:
            try:
                material = Material.objects.get(
                    id=item['item_id'],
                    subject__tutor=request.user
                )
                material.order = item['new_order']
                material.save()
            except Material.DoesNotExist:
                pass
        
        return Response({'message': 'Materials reordered successfully'})


class SubjectEnrollmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing subject enrollments
    Only accessible by tutors
    """
    serializer_class = SubjectEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']  # No PUT/PATCH
    
    def get_queryset(self):
        user = self.request.user
        
        # Tutors see enrollments for their subjects
        if user.user_type == 'TUTOR':
            return SubjectEnrollment.objects.filter(
                subject__tutor=user
            ).select_related('student', 'subject')
        
        # Students see their own enrollments
        elif user.user_type == 'STUDENT':
            return SubjectEnrollment.objects.filter(
                student=user
            ).select_related('subject')
        
        return SubjectEnrollment.objects.none()
    
    def perform_create(self, serializer):
        # Only tutors can manually enroll students
        if self.request.user.user_type != 'TUTOR':
            raise permissions.PermissionDenied("Only tutors can enroll students")
        
        # Check that tutor owns the subject
        subject = serializer.validated_data['subject']
        if subject.tutor != self.request.user:
            raise permissions.PermissionDenied("You can only enroll students in your own subjects")
        
        serializer.save()