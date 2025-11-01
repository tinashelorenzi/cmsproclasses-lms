# Authentication Setup Guide

This guide will help you set up and test the authentication system for the Capital Mathematics Studies LMS.

## Prerequisites

- Python 3.10+ installed
- Node.js 18+ and npm installed
- Backend virtual environment activated
- Frontend dependencies installed

## Backend Setup

### Step 1: Create Environment File

```bash
cd Backend
cp .env.example .env
```

Edit `.env` if you want to customize the SECRET_KEY.

### Step 2: Run Migrations

⚠️ **Important**: Since migrations have NOT been run yet, you need to create and apply them:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 3: Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin user.

### Step 4: Start Backend Server

```bash
python manage.py runserver
```

The backend will run on `http://localhost:8000`

## Frontend Setup

### Step 1: Start Development Server

In a new terminal:

```bash
cd Frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Testing Authentication

### Option 1: Use Django Admin to Create Users

1. Navigate to `http://localhost:8000/admin`
2. Login with superuser credentials
3. Go to "Users" section
4. Add a new user with one of these user types:
   - **STUDENT**
   - **TUTOR**
   - **PARENT**
5. Set a password for the user
6. Save the user

### Option 2: Use Command-Line Scripts

For a quick way to create user accounts interactively:

```bash
# Create a tutor account
python Scripts/create_tutor.py

# Create a student account
python Scripts/create_student.py

# Create a parent account
python Scripts/create_parent.py
```

These scripts validate input, handle phone numbers with South African country codes, and auto-verify accounts.

See `Backend/Scripts/README.md` for more details.

### Option 3: Use the API to Register

You can use curl, Postman, or any HTTP client to register:

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "email": "student1@example.com",
    "password": "securepass123",
    "password_confirm": "securepass123",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "STUDENT"
  }'
```

### Option 4: Test Login via Frontend

1. Open `http://localhost:5173` in your browser
2. Enter the username and password you created
3. Click "Sign In"
4. You should be redirected to the appropriate dashboard based on user type

## API Endpoints Reference

### Register User
- **URL**: `POST /api/auth/register/`
- **Payload**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "password_confirm": "string",
  "first_name": "string",
  "last_name": "string",
  "user_type": "STUDENT|TUTOR|PARENT",
  "phone_number": "string (optional)",
  "date_of_birth": "YYYY-MM-DD (optional)"
}
```

### Login
- **URL**: `POST /api/auth/login/`
- **Payload**:
```json
{
  "username": "string (email, phone, or username)",
  "password": "string"
}
```

**Note**: The `username` field accepts:
- Email address (e.g., `user@example.com`)
- Phone number (e.g., `+27821234567` or `0821234567`)
- Username (e.g., `johndoe`)

### Get User Info
- **URL**: `GET /api/auth/user-info/`
- **Headers**: `Authorization: Bearer <access_token>`

### Refresh Token
- **URL**: `POST /api/auth/token/refresh/`
- **Payload**:
```json
{
  "refresh": "string"
}
```

### Update Profile
- **URL**: `PATCH /api/auth/profile/`
- **Headers**: `Authorization: Bearer <access_token>`

## User Types

The system supports three distinct user types:

1. **STUDENT**: Students can access courses, view materials, and track their progress
2. **TUTOR**: Tutors can create courses, manage students, and provide feedback
3. **PARENT**: Parents can view their children's progress and communicate with tutors

## Token Management

- **Access Token**: Valid for 1 hour, used for API requests
- **Refresh Token**: Valid for 7 days, used to obtain new access tokens
- Tokens are automatically stored in localStorage on successful login
- Tokens are automatically refreshed when expired
- Logout clears all tokens from localStorage

## Troubleshooting

### Backend Issues

1. **Migration errors**: Make sure you've activated the virtual environment
2. **Import errors**: Check that all dependencies are installed (`pip install -r requirements.txt`)
3. **CORS errors**: Verify the frontend URL is in `CORS_ALLOWED_ORIGINS`

### Frontend Issues

1. **Login redirects to login page**: Check that tokens are being stored in localStorage
2. **API errors**: Verify backend is running and URL is correct in `.env`
3. **Network errors**: Check that CORS is properly configured in backend
4. **Login fails with email/phone**: Ensure the user exists with that email or phone number

### Common Solutions

```bash
# Reinstall backend dependencies
cd Backend
source venv/bin/activate
pip install -r requirements.txt

# Reinstall frontend dependencies
cd Frontend
rm -rf node_modules
npm install

# Clear browser localStorage
# Open browser console and run:
localStorage.clear()
```

## Next Steps

Now that authentication is working, you can:

1. Create role-specific dashboards for each user type
2. Implement course management features
3. Add student-tutor-parent relationships
4. Build progress tracking and analytics
5. Create messaging/communication features

## Support

If you encounter any issues, please check:
- Console logs in browser (F12)
- Terminal output for both backend and frontend
- Django admin panel for user data
- Network tab in browser DevTools for API requests

