from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model for Capital Mathematics Studies LMS
    """
    USER_TYPE_CHOICES = [
        ('PARENT', 'Parent'),
        ('TUTOR', 'Tutor'),
        ('STUDENT', 'Student'),
    ]
    
    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES,
        default='STUDENT'
    )
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, default='South Africa')
    date_of_birth = models.DateField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        db_table = "users"
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"
