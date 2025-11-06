from rest_framework import serializers
from .models import Subject, SubjectEnrollment, Announcement, Material
from django.contrib.auth import get_user_model

User = get_user_model()


class TutorBasicSerializer(serializers.ModelSerializer):
    """Basic tutor information for nested serialization"""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'first_name', 'last_name']
        read_only_fields = fields


class StudentBasicSerializer(serializers.ModelSerializer):
    """Basic student information for nested serialization"""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'first_name', 'last_name']
        read_only_fields = fields


class AnnouncementSerializer(serializers.ModelSerializer):
    """Serializer for Announcements"""
    created_by = TutorBasicSerializer(read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'subject', 'subject_name', 'title', 'content',
            'created_by', 'published_date', 'order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']
    
    def create(self, validated_data):
        # Automatically set created_by to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class MaterialSerializer(serializers.ModelSerializer):
    """Serializer for Materials"""
    created_by = TutorBasicSerializer(read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Material
        fields = [
            'id', 'subject', 'subject_name', 'title', 'description',
            'material_type', 'video_url', 'video_platform',
            'file', 'file_url', 'created_by', 'order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']
    
    def get_file_url(self, obj):
        """Get the full URL for the file if it exists"""
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
    
    def create(self, validated_data):
        # Automatically set created_by to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate(self, data):
        """Validate material based on type"""
        material_type = data.get('material_type')
        
        if material_type == 'VIDEO':
            if not data.get('video_url') or not data.get('video_platform'):
                raise serializers.ValidationError(
                    "Video materials must have both video_url and video_platform"
                )
            # Clear file field for video materials
            data['file'] = None
        
        elif material_type == 'FILE':
            if not data.get('file'):
                raise serializers.ValidationError(
                    "File materials must have an uploaded file"
                )
            # Clear video fields for file materials
            data['video_url'] = None
            data['video_platform'] = None
        
        return data


class SubjectEnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for Subject Enrollments"""
    student = StudentBasicSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(user_type='STUDENT'),
        source='student',
        write_only=True
    )
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    
    class Meta:
        model = SubjectEnrollment
        fields = [
            'id', 'student', 'student_id', 'subject', 'subject_name',
            'enrolled_date', 'is_active'
        ]
        read_only_fields = ['enrolled_date']


class SubjectListSerializer(serializers.ModelSerializer):
    """Serializer for listing subjects (less detail)"""
    tutor = TutorBasicSerializer(read_only=True)
    enrolled_students_count = serializers.IntegerField(read_only=True)
    is_enrolled = serializers.SerializerMethodField()
    
    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'grade_level', 'year', 'curriculum_type',
            'tutor', 'schedule_days', 'schedule_times', 'description',
            'is_active', 'enrolled_students_count', 'is_enrolled',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_is_enrolled(self, obj):
        """Check if current user is enrolled in this subject"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if request.user.user_type == 'STUDENT':
                return obj.enrollments.filter(
                    student=request.user,
                    is_active=True
                ).exists()
        return False


class SubjectDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed subject view (with announcements and materials)"""
    tutor = TutorBasicSerializer(read_only=True)
    tutor_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(user_type='TUTOR'),
        source='tutor',
        write_only=True,
        required=False
    )
    
    announcements = AnnouncementSerializer(many=True, read_only=True)
    materials = MaterialSerializer(many=True, read_only=True)
    enrollments = SubjectEnrollmentSerializer(many=True, read_only=True)
    
    enrolled_students_count = serializers.IntegerField(read_only=True)
    is_enrolled = serializers.SerializerMethodField()
    
    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'grade_level', 'year', 'curriculum_type',
            'tutor', 'tutor_id', 'schedule_days', 'schedule_times',
            'description', 'is_active',
            'announcements', 'materials', 'enrollments',
            'enrolled_students_count', 'is_enrolled',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'tutor']
    
    def get_is_enrolled(self, obj):
        """Check if current user is enrolled in this subject"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if request.user.user_type == 'STUDENT':
                return obj.enrollments.filter(
                    student=request.user,
                    is_active=True
                ).exists()
        return False
    
    def create(self, validated_data):
        # Automatically set tutor to the current user if they're a tutor
        request = self.context.get('request')
        if request and request.user.user_type == 'TUTOR':
            validated_data['tutor'] = request.user
        return super().create(validated_data)


class ReorderSerializer(serializers.Serializer):
    """Serializer for reordering items"""
    item_id = serializers.IntegerField()
    new_order = serializers.IntegerField(min_value=0)