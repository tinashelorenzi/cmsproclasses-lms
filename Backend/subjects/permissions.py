from rest_framework import permissions


class IsTutorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow tutors to create/edit objects.
    Students and others have read-only access.
    """
    
    def has_permission(self, request, view):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Write permissions are only allowed to tutors
        return request.user and request.user.is_authenticated and request.user.user_type == 'TUTOR'
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the tutor who owns the subject
        if hasattr(obj, 'tutor'):
            return obj.tutor == request.user
        
        return False


class IsTutorOfSubject(permissions.BasePermission):
    """
    Custom permission to only allow tutors to edit their own subjects
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.user_type == 'TUTOR'
    
    def has_object_permission(self, request, view, obj):
        # Check if object is a subject
        if hasattr(obj, 'tutor'):
            return obj.tutor == request.user
        
        # Check if object belongs to a subject (like Announcement or Material)
        if hasattr(obj, 'subject'):
            return obj.subject.tutor == request.user
        
        return False


class IsEnrolledStudent(permissions.BasePermission):
    """
    Custom permission to only allow enrolled students to view content
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Tutors can always access
        if user.user_type == 'TUTOR':
            if hasattr(obj, 'tutor'):
                return obj.tutor == user
            if hasattr(obj, 'subject'):
                return obj.subject.tutor == user
        
        # Students must be enrolled
        if user.user_type == 'STUDENT':
            if hasattr(obj, 'enrollments'):
                # Object is a subject
                return obj.enrollments.filter(student=user, is_active=True).exists()
            elif hasattr(obj, 'subject'):
                # Object belongs to a subject (Announcement or Material)
                return obj.subject.enrollments.filter(student=user, is_active=True).exists()
        
        return False


class IsTutor(permissions.BasePermission):
    """
    Custom permission to only allow tutors
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.user_type == 'TUTOR'