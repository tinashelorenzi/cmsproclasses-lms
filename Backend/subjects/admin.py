from django.contrib import admin
from .models import Subject, SubjectEnrollment, Announcement, Material


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'grade_level', 'year', 'curriculum_type',
        'tutor', 'is_active', 'enrolled_students_count', 'created_at'
    ]
    list_filter = ['grade_level', 'curriculum_type', 'year', 'is_active', 'created_at']
    search_fields = ['name', 'tutor__username', 'tutor__first_name', 'tutor__last_name']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'enrolled_students_count']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'grade_level', 'year', 'curriculum_type', 'description')
        }),
        ('Tutor', {
            'fields': ('tutor',)
        }),
        ('Schedule', {
            'fields': ('schedule_days', 'schedule_times')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Metadata', {
            'fields': ('enrolled_students_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(SubjectEnrollment)
class SubjectEnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'subject', 'enrolled_date', 'is_active']
    list_filter = ['is_active', 'enrolled_date', 'subject']
    search_fields = [
        'student__username', 'student__first_name', 'student__last_name',
        'subject__name'
    ]
    ordering = ['-enrolled_date']
    readonly_fields = ['enrolled_date']
    
    fieldsets = (
        ('Enrollment', {
            'fields': ('student', 'subject')
        }),
        ('Status', {
            'fields': ('is_active', 'enrolled_date')
        }),
    )


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'subject', 'created_by', 'published_date',
        'order', 'created_at'
    ]
    list_filter = ['published_date', 'created_at', 'subject']
    search_fields = ['title', 'content', 'subject__name', 'created_by__username']
    ordering = ['order', '-published_date']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Content', {
            'fields': ('subject', 'title', 'content')
        }),
        ('Publishing', {
            'fields': ('published_date', 'order')
        }),
        ('Author', {
            'fields': ('created_by',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'subject', 'material_type', 'created_by',
        'order', 'created_at'
    ]
    list_filter = ['material_type', 'video_platform', 'created_at', 'subject']
    search_fields = ['title', 'description', 'subject__name', 'created_by__username']
    ordering = ['order', '-created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('subject', 'title', 'description', 'material_type', 'order')
        }),
        ('Video Information', {
            'fields': ('video_url', 'video_platform'),
            'classes': ('collapse',),
            'description': 'Only for VIDEO type materials'
        }),
        ('File Information', {
            'fields': ('file',),
            'classes': ('collapse',),
            'description': 'Only for FILE type materials'
        }),
        ('Author', {
            'fields': ('created_by',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        """Automatically set created_by if not set"""
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)