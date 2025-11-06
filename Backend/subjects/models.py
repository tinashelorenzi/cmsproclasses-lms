from django.db import models
from django.conf import settings

class Subject(models.Model):
    """
    Subject/Course model - represents a class/course
    """
    CURRICULUM_CHOICES = [
        ('CAPS', 'CAPS'),
        ('IEB', 'IEB'),
        ('CAMBRIDGE', 'Cambridge'),
        ('IB', 'International Baccalaureate'),
        ('OTHER', 'Other'),
    ]
    
    GRADE_CHOICES = [
        ('8', 'Grade 8'),
        ('9', 'Grade 9'),
        ('10', 'Grade 10'),
        ('11', 'Grade 11'),
        ('12', 'Grade 12'),
    ]
    
    WEEKDAY_CHOICES = [
        ('MON', 'Monday'),
        ('TUE', 'Tuesday'),
        ('WED', 'Wednesday'),
        ('THU', 'Thursday'),
        ('FRI', 'Friday'),
        ('SAT', 'Saturday'),
        ('SUN', 'Sunday'),
    ]
    
    name = models.CharField(max_length=200, help_text="Course/Subject name")
    grade_level = models.CharField(max_length=2, choices=GRADE_CHOICES, help_text="Grade level")
    year = models.IntegerField(help_text="Academic year (e.g., 2024)")
    curriculum_type = models.CharField(max_length=20, choices=CURRICULUM_CHOICES, default='CAPS')
    
    # Tutor who created/manages this subject
    tutor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='taught_subjects',
        limit_choices_to={'user_type': 'TUTOR'}
    )
    
    # Schedule information
    schedule_days = models.JSONField(
        default=list,
        help_text="List of days the class meets (e.g., ['MON', 'WED', 'FRI'])"
    )
    schedule_times = models.CharField(
        max_length=200,
        blank=True,
        help_text="Class times (e.g., '14:00-15:30')"
    )
    
    # Additional info
    description = models.TextField(blank=True, help_text="Subject description")
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Subject'
        verbose_name_plural = 'Subjects'
    
    def __str__(self):
        return f"{self.name} - Grade {self.grade_level} ({self.year})"
    
    @property
    def enrolled_students_count(self):
        return self.enrollments.filter(is_active=True).count()


class SubjectEnrollment(models.Model):
    """
    Links students to subjects they're enrolled in
    """
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subject_enrollments',
        limit_choices_to={'user_type': 'STUDENT'}
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    
    enrolled_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['student', 'subject']
        ordering = ['-enrolled_date']
        verbose_name = 'Subject Enrollment'
        verbose_name_plural = 'Subject Enrollments'
    
    def __str__(self):
        return f"{self.student.get_full_name()} enrolled in {self.subject.name}"


class Announcement(models.Model):
    """
    Announcements for a subject - created by tutors
    """
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='announcements'
    )
    
    title = models.CharField(max_length=200)
    content = models.TextField(help_text="Full announcement text")
    
    # Who created this announcement
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_announcements'
    )
    
    # When to publish
    published_date = models.DateTimeField(help_text="When this announcement becomes visible")
    
    # For ordering/sorting
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', '-published_date']
        verbose_name = 'Announcement'
        verbose_name_plural = 'Announcements'
    
    def __str__(self):
        return f"{self.title} - {self.subject.name}"


class Material(models.Model):
    """
    Learning materials for a subject - can be videos or files
    """
    MATERIAL_TYPE_CHOICES = [
        ('VIDEO', 'Video'),
        ('FILE', 'File/Document'),
    ]
    
    VIDEO_PLATFORM_CHOICES = [
        ('YOUTUBE', 'YouTube'),
        ('VIMEO', 'Vimeo'),
        ('DAILYMOTION', 'Dailymotion'),
    ]
    
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='materials'
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, help_text="Material description")
    
    material_type = models.CharField(max_length=10, choices=MATERIAL_TYPE_CHOICES)
    
    # For video materials
    video_url = models.URLField(
        blank=True,
        null=True,
        help_text="Full URL to the video"
    )
    video_platform = models.CharField(
        max_length=20,
        choices=VIDEO_PLATFORM_CHOICES,
        blank=True,
        null=True
    )
    
    # For file materials
    file = models.FileField(
        upload_to='subject_materials/%Y/%m/',
        blank=True,
        null=True,
        help_text="Upload document/file"
    )
    
    # Who created this material
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_materials'
    )
    
    # For ordering/sorting
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Material'
        verbose_name_plural = 'Materials'
    
    def __str__(self):
        return f"{self.title} ({self.material_type}) - {self.subject.name}"
    
    def clean(self):
        from django.core.exceptions import ValidationError
        
        # Validate that video materials have video_url and video_platform
        if self.material_type == 'VIDEO':
            if not self.video_url or not self.video_platform:
                raise ValidationError("Video materials must have a video URL and platform")
        
        # Validate that file materials have a file
        if self.material_type == 'FILE':
            if not self.file:
                raise ValidationError("File materials must have an uploaded file")