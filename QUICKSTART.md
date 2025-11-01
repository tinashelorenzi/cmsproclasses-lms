# CMS LMS Quick Start Guide

## 🚀 First Time Setup

### 1. Backend Setup

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. Frontend Setup (New Terminal)

```bash
cd Frontend
npm install
npm run dev
```

### 3. Access Applications

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin

## 👤 Creating Users

### Quick Method: Use Scripts

```bash
# Activate venv first
source venv/bin/activate

# Create accounts
python Scripts/create_tutor.py
python Scripts/create_student.py
python Scripts/create_parent.py
```

### Via Django Admin

1. Go to http://localhost:8000/admin
2. Login with superuser
3. Go to Users → Add User

### Via API

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user",
    "email": "user@example.com",
    "password": "password123",
    "password_confirm": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "STUDENT"
  }'
```

## 📱 Login Methods

Users can login with:
1. **Email** (e.g., `john@example.com`)
2. **Username** (e.g., `johndoe`)
3. **Phone number** (if provided, e.g., `+27821234567`)

## 🇿🇦 South African Phone Formats

Accepted formats:
- `+27821234567` (International)
- `0821234567` (National)
- `27821234567` (Auto-corrected to +27)

## 🎨 Design System

### Colors
- Primary: `#0178c5` (Blue)
- Secondary: `#ffcf00` (Gold/Yellow)
- Background: `#ffffff` (White)
- Text: `#000004` (Near Black)

### Tech Stack
- **Backend**: Django 5.2, DRF, JWT Auth
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v3, Radix UI

## 🔑 Default Settings

- **Country**: South Africa (all users)
- **JWT Access**: 1 hour lifetime
- **JWT Refresh**: 7 days lifetime
- **Token Auto-Refresh**: Enabled

## 📁 Project Structure

```
cmsproclasses/
├── Backend/
│   ├── accounts/        # User models & auth
│   ├── Scripts/         # Management scripts
│   └── cmsprobackend/   # Django config
├── Frontend/
│   ├── src/
│   │   ├── pages/       # Pages (Login, Dashboard)
│   │   ├── ui/          # Reusable components
│   │   └── lib/         # Utilities & auth helpers
│   └── public/          # Static assets
└── AUTH_SETUP.md        # Detailed auth guide
```

## 🐛 Troubleshooting

### Backend issues

```bash
# Reinstall dependencies
pip install -r requirements.txt

# Reset database
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Frontend issues

```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Clear browser cache
localStorage.clear()  # In browser console
```

### CORS errors

Verify in `Backend/cmsprobackend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

## 📚 Additional Resources

- **Full Auth Guide**: `AUTH_SETUP.md`
- **Scripts Documentation**: `Backend/Scripts/README.md`
- **Backend README**: `Backend/README.md`
- **Frontend README**: `Frontend/README.md`

## 🎯 Next Steps

1. ✅ Authentication working
2. ⏳ Course management
3. ⏳ Student-Tutor assignments
4. ⏳ Progress tracking
5. ⏳ Messaging system
6. ⏳ Payment integration

## 💡 Tips

- Use scripts for bulk user creation
- Keep venv activated when working with backend
- Check browser console for frontend errors
- Use Django admin for quick user management
- JWT tokens auto-refresh on expiry

## 🆘 Support

- Check console logs (F12 in browser)
- Review terminal output
- Verify .env files are configured
- Ensure migrations are up to date
- Check network requests in DevTools

