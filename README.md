# Capital Mathematics Studies - LMS

A comprehensive Learning Management System for Capital Mathematics Studies tutoring institution.

## Project Structure

This project is split into two main components:

- **Backend**: Django REST Framework API
- **Frontend**: React + TypeScript + Vite + Tailwind CSS v3 + Radix UI

## Tech Stack

### Backend
- Django 5.2.7
- Django REST Framework 3.16.1
- Django REST Framework Simple JWT 5.5.1
- Django CORS Headers 4.9.0
- Python-dotenv 1.2.1

### Frontend
- React 19.1.1
- TypeScript 5.9.3
- Vite 7.1.7
- React Router 7.9.5
- Tailwind CSS v3
- Radix UI (Headless UI primitives)
- @heroicons/react (Icons)
- lucide-react (Additional icons)
- class-variance-authority (Component variants)
- axios (HTTP client)

## Color Palette

- **Primary**: `#0178c5` (Blue)
- **Secondary**: `#ffcf00` (Gold/Yellow)
- **Background**: `#ffffff` (White)
- **Text**: `#000004` (Near Black)

## Getting Started

### Backend Setup

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configurations
python manage.py migrate  # Run migrations when ready
python manage.py createsuperuser  # Create admin user
python manage.py runserver
```

Backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## Authentication

The system supports three user types:
- **Parent**: Parents can view their children's progress
- **Tutor**: Tutors can manage courses and students
- **Student**: Students can access courses and track their progress

### API Endpoints

- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and receive JWT tokens
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/user-info/` - Get current user information
- `GET /api/auth/profile/` - Get/update user profile

### Protected Routes

Frontend protected routes:
- `/dashboard` - Main dashboard
- `/student` - Student dashboard
- `/tutor` - Tutor dashboard
- `/parent` - Parent dashboard

## Development Notes

⚠️ **Important**: Before running the backend, you need to:
1. Create and configure `.env` file from `.env.example`
2. Run migrations: `python manage.py migrate`
3. Create a superuser: `python manage.py createsuperuser`

The project follows TypeScript best practices for type safety and uses JWT authentication for secure API access.

## License

Copyright © 2024 Capital Mathematics Studies

