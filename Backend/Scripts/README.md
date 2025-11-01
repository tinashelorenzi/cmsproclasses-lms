# CMS Management Scripts

This directory contains utility scripts for managing Capital Mathematics Studies LMS accounts.

## Prerequisites

- Django virtual environment must be activated
- Database migrations must be run
- You should be in the `Backend` directory when running these scripts

## Available Scripts

### create_tutor.py
Creates a new tutor account interactively.

**Usage:**
```bash
cd Backend
source venv/bin/activate
python Scripts/create_tutor.py
```

**Features:**
- Interactive prompts for all required information
- Validates email format
- Validates South African phone numbers
- Generates username from email automatically
- Checks for duplicate emails/phones
- Auto-verifies newly created tutors

### create_student.py
Creates a new student account interactively.

**Usage:**
```bash
python Scripts/create_student.py
```

### create_parent.py
Creates a new parent account interactively.

**Usage:**
```bash
python Scripts/create_parent.py
```

## Common Workflow

1. Activate virtual environment:
```bash
source venv/bin/activate
```

2. Navigate to Backend directory:
```bash
cd Backend
```

3. Run the desired script:
```bash
python Scripts/create_tutor.py
```

## South African Phone Number Formats

The scripts accept the following phone number formats:
- `+27XXXXXXXXX` (International format, 12 digits)
- `0XXXXXXXXX` (National format, 10 digits)
- `27XXXXXXXXX` (Without plus, 11 digits - auto-corrected to +27XXXXXXXXX)

## User Information Collected

- **Required Fields:**
  - First Name
  - Last Name
  - Email Address
  - Password

- **Optional Fields:**
  - Phone Number
  - Date of Birth

## Auto-Generated Fields

- **Username:** Generated from email address (e.g., `john.doe@example.com` → `john.doe`)
- **User Type:** Based on the script you run (TUTOR/STUDENT/PARENT)
- **Country:** Defaults to "South Africa"
- **Active/Verified:** Set to True for manually created accounts

## Login Methods

Users can login using any of these methods:
1. Email address
2. Auto-generated username
3. Phone number (if provided)

## Security Notes

- Passwords must be at least 8 characters
- Passwords are hashed using Django's secure password hashing
- Existing emails and phones are checked to prevent duplicates
- Users are auto-verified for manually created accounts

## Troubleshooting

### "Command not found"
Make sure you're in the Backend directory and the virtual environment is activated.

### "No module named django"
Activate the virtual environment:
```bash
source venv/bin/activate
```

### "OperationalError: no such table"
Run migrations first:
```bash
python manage.py migrate
```

### "Invalid email format"
Ensure the email contains `@` and at least one `.`

### "This email/phone is already registered"
The email or phone number is already in use. Use a different one or check existing users in Django admin.

## Example Session

```bash
$ python Scripts/create_tutor.py
================================================================================
Capital Mathematics Studies - Tutor Account Creation
================================================================================

Please provide the following information:

First Name: John
Last Name: Doe
Email Address: john.doe@cms.academy
Do you want to add a phone number? (y/n): y
Phone Number (South Africa format: +27XXXXXXXXX or 0XXXXXXXXX): +27821234567
Do you want to add date of birth? (y/n): n
Password: ********
Confirm Password: ********

================================================================================
✓ Tutor account created successfully!
================================================================================
Username: john.doe
Email: john.doe@cms.academy
Name: John Doe
Phone: +27821234567
User Type: Tutor

The tutor can now login using:
  - Email: john.doe@cms.academy
  - Username: john.doe
  - Phone: +27821234567
```

## Integration with Django Admin

Alternatively, you can create users through the Django admin interface:
1. Navigate to `http://localhost:8000/admin`
2. Login with superuser credentials
3. Go to "Users" section
4. Click "Add User"
5. Fill in the form

The scripts provide a more streamlined command-line interface for bulk user creation.

