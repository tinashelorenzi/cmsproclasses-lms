#!/usr/bin/env python
"""
Interactive script to create a tutor account for Capital Mathematics Studies LMS.

This script allows you to create a tutor with all necessary profile information
including email, phone number, and personal details.
"""

import os
import sys
import django
from pathlib import Path

# Setup Django
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cmsprobackend.settings')
django.setup()

from accounts.models import User
from django.core.exceptions import ValidationError


def get_input(prompt, required=True, input_type=str):
    """Get input from user with validation"""
    while True:
        try:
            value = input(prompt).strip()
            if required and not value:
                print("This field is required. Please try again.")
                continue
            if input_type == int:
                return int(value)
            elif input_type == str:
                return value
        except ValueError:
            print("Invalid input. Please try again.")
        except KeyboardInterrupt:
            print("\n\nOperation cancelled.")
            sys.exit(0)


def validate_email(email):
    """Basic email validation"""
    if '@' not in email or '.' not in email:
        raise ValidationError("Invalid email format")
    return email


def validate_phone(phone, country="South Africa"):
    """Validate phone number format for South Africa"""
    # Remove common formatting characters
    phone = phone.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
    
    # South Africa phone numbers
    if country == "South Africa":
        # Should start with +27 or 0, then 9 digits
        if phone.startswith('+27'):
            if len(phone) == 12:  # +27XXXXXXXXX
                return phone
        elif phone.startswith('0'):
            if len(phone) == 10:  # 0XXXXXXXXX
                return phone
        elif phone.startswith('27'):
            if len(phone) == 11:  # 27XXXXXXXXX
                return f"+{phone}"
    
    return phone  # Return as-is if it doesn't match


def generate_username_from_email(email):
    """Generate a username from email"""
    return email.split('@')[0]


def main():
    """Main function to create tutor account"""
    print("=" * 80)
    print("Capital Mathematics Studies - Tutor Account Creation")
    print("=" * 80)
    print()
    
    # Get personal information
    print("Please provide the following information:")
    print()
    
    first_name = get_input("First Name: ", required=True)
    last_name = get_input("Last Name: ", required=True)
    
    # Email
    while True:
        email = get_input("Email Address: ", required=True).lower()
        try:
            validate_email(email)
            # Check if email already exists
            if User.objects.filter(email=email).exists():
                print("This email is already registered. Please use a different email.")
                continue
            break
        except ValidationError:
            print("Invalid email format. Please try again.")
    
    # Phone number
    phone_number = None
    use_phone = get_input("Do you want to add a phone number? (y/n): ", required=False)
    if use_phone.lower() in ['y', 'yes']:
        country = "South Africa"  # Default country
        while True:
            phone = get_input(
                f"Phone Number (South Africa format: +27XXXXXXXXX or 0XXXXXXXXX): ",
                required=False
            )
            if phone:
                phone_number = validate_phone(phone, country)
                # Check if phone already exists
                if User.objects.filter(phone_number=phone_number).exists():
                    print("This phone number is already registered. Please use a different number.")
                    continue
                break
            else:
                break
    
    # Date of birth
    date_of_birth = None
    use_dob = get_input("Do you want to add date of birth? (y/n): ", required=False)
    if use_dob.lower() in ['y', 'yes']:
        dob_input = get_input("Date of Birth (YYYY-MM-DD) or leave empty: ", required=False)
        if dob_input:
            try:
                from datetime import datetime
                date_of_birth = datetime.strptime(dob_input, '%Y-%m-%d').date()
            except ValueError:
                print("Invalid date format. Skipping date of birth.")
    
    # Password
    while True:
        password = get_input("Password: ", required=True)
        password_confirm = get_input("Confirm Password: ", required=True)
        if password != password_confirm:
            print("Passwords do not match. Please try again.")
            continue
        if len(password) < 8:
            print("Password must be at least 8 characters long.")
            continue
        break
    
    # Generate username
    username = generate_username_from_email(email)
    
    # Check if username already exists, if so, add a number
    original_username = username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{original_username}{counter}"
        counter += 1
    
    # Create user
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            user_type='TUTOR',
            phone_number=phone_number if phone_number else None,
            date_of_birth=date_of_birth,
            is_active=True,
            is_verified=True,  # Auto-verify for manually created tutors
        )
        
        print()
        print("=" * 80)
        print("✓ Tutor account created successfully!")
        print("=" * 80)
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Name: {user.get_full_name()}")
        print(f"Phone: {user.phone_number if user.phone_number else 'Not provided'}")
        print(f"User Type: {user.get_user_type_display()}")
        print(f"User ID: {user.id}")
        print()
        print("The tutor can now login using:")
        print(f"  - Email: {email}")
        print(f"  - Username: {username}")
        if phone_number:
            print(f"  - Phone: {phone_number}")
        print()
        
    except Exception as e:
        print()
        print("=" * 80)
        print("✗ Error creating tutor account")
        print("=" * 80)
        print(f"Error: {str(e)}")
        print()
        sys.exit(1)


if __name__ == "__main__":
    main()

