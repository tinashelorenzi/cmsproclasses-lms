# CMS Backend API

Django REST Framework backend for Capital Mathematics Studies LMS.

## Installation

1. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Setup environment variables:
```bash
cp .env.example .env
# Edit .env with your secret key and configurations
```

4. Run migrations (when ready):
```bash
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Start development server:
```bash
python manage.py runserver
```

## Project Structure

- `cmsprobackend/` - Main Django project configuration
- `accounts/` - User management app (created, to be configured)
- `venv/` - Python virtual environment
- `.env` - Environment variables (not in git)

## API Documentation

API documentation will be available at `/api/` once endpoints are implemented.

## Django Apps

### Installed Apps
- `rest_framework` - REST API framework
- `corsheaders` - CORS handling for frontend
- `accounts` - User authentication and management

## Environment Variables

Required environment variables (in `.env`):
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `ALLOWED_HOSTS` - Allowed hosts (comma-separated)

## Notes

- CORS is configured to allow requests from localhost:5173
- Media files are stored in `/media`
- Static files are collected in `/staticfiles`

