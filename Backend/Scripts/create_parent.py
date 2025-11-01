#!/usr/bin/env python
"""
Interactive script to create a parent account for Capital Mathematics Studies LMS.
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


def get_input(prompt, required=True):
    """Get input from user with validation"""
    while True:
        try:
            value = input(prompt).strip()
            if required and not value:
                print("This field is required. Please try again.")
                continue
            return value
        except KeyboardInterrupt:
            print("\n\nOperation cancelled.")
            sys.exit(0)


def validate_email(email):
    """Basic email validation"""
    if '@' not in email or '.' not in email:
        raise ValidationError("Invalid email format")
    return email


def validate_phone(phone):
    """Validate phone number format for South Africa"""
    phone = phone.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
    
    if phone.startswith('+27'):
        if len(phone) == 12:
            return phone
    elif phone.startswith('0'):
        if len(phone) == 10:
            return phone
    elif phone.startswith('27'):
        if len(phone) == 11:
            return f"+{phone}"
    
    return phone


def generate_username_from_email(email):
    """Generate a username from email"""
    return email.split('@')[0]


def main():
    """Main function to create parent account"""
    print("=" * 80)
    print("Capital Mathematics Studies - Parent Account Creation")
    print("=" * 80)
    print()
    
    print("Please provide the following information:")
    print()
    
    first_name = get_input("First Name: ", required=True)
    last_name = get_input("Last Name: ", required=True)
    
    # Email
    while True:
        email = get_input("Email Address: ", required=True).lower()
        try:
            validate_email(email)
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
        while True:
            phone = get_input(
                "Phone Number (South Africa format: +27XXXXXXXXX or 0XXXXXXXXX): ",
                required=False
            )
            if phone:
                phone_number = validate_phone(phone)
                if User.objects.filter(phone_number=phone_number).exists():
                    print("This phone number is already registered.")
                    continue
                break
            else:
                break
    
    # Date of birth
    date_of_birth = None
    use_dob = get_input("Do you want to add date of birth? (y/n): ", required=False)
    if use_dob.lower() in ['y', 'yes']:
        dob_input = get_input("Date of Birth (YYYY-MM-DD): ", required=False)
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
            user_type='PARENT',
            phone_number=phone_number if phone_number else None,
            date_of_birth=date_of_birth,
            is_active=True,
            is_verified=True,
        )
        
        print()
        print("=" * 80)
        print("✓ Parent account created successfully!")
        print("=" * 80)
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Name: {user.get_full_name()}")
        print(f"Phone: {user.phone_number if user.phone_number else 'Not provided'}")
        print(f"User Type: {user.get_user_type_display()}")
        print()
        print("The parent can now login using:")
        print(f"  - Email: {email}")
        print(f"  - Username: {username}")
        if phone_number:
            print(f"  - Phone: {phone_number}")
        print()
        
    except Exception as e:
        print()
        print("=" * 80)
        print("✗ Error creating parent account")
        print("=" * 80)
        print(f"Error: {str(e)}")
        print()
        sys.exit(1)


if __name__ == "__main__":
    main()

