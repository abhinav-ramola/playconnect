# 🎯 PlayConnect - Complete Setup Guide

A production-ready MERN stack sports matchmaking platform.

## 📋 Prerequisites

Before you start, ensure you have installed:
- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas account) - [Download](https://www.mongodb.com/) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Postman** (optional, for API testing) - [Download](https://www.postman.com/downloads/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

## 🚀 Project Setup

### Step 1: MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition for your OS
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (if installed via Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/playconnect`

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already provided as .env.example)
# Update if using MongoDB Atlas instead of local

# Start development server
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════╗
║     🎯 PlayConnect Backend Server      ║
║          Server Running on PORT 5000      ║
╚═══════════════════════════════════════╝
✅ MongoDB Connected: localhost
```

### Step 3: Frontend Setup

```bash
# Open new terminal/PowerShell window
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE Frontend running at:

  ➜  Local:   http://localhost:3000/
  ➜  Press h + enter to show help
```

## 🔐 First Time Setup

### 1. Create Test User

**Option A: Via Frontend**
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Password: password123
   - City: New York

**Option B: Via Postman**

1. Open Postman
2. Create a new request
3. **POST** to `http://localhost:5000/api/auth/signup`
4. Body (JSON):
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "phone": "9876543210",
  "password": "password123",
  "city": "New York",
  "sportPreferences": ["cricket", "football"]
}
```

### 2. Test Login

**Frontend:**
1. Go to http://localhost:3000/login
2. Email: test@example.com
3. Password: password123

**Postman:**
```bash
POST http://localhost:5000/api/auth/login

{
  "email": "test@example.com",
  "password": "password123"
}
```

Response will include JWT token - save this for API testing!

## 🧪 Testing APIs with Postman

### Setup Postman Environment

1. **Create Collection** - Right-click → "New Collection" → "PlayConnect"

2. **Set Base URL** - Create environment variable:
   - Click "Environments"
   - New environment: "PlayConnect Dev"
   - Variable: `base_url` = `http://localhost:5000/api`
   - Variable: `token` = (paste your JWT token from login response)

3. **Use in Requests** - In headers:
   - Key: `Authorization`
   - Value: `Bearer {{token}}`

### Sample API Tests

#### 1. Create Match
```bash
POST /matches
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Sunday Cricket Match",
  "description": "Friendly cricket match at Central Park",
  "sport": "cricket",
  "playersNeeded": 11,
  "matchDate": "2024-03-31T14:00:00Z",
  "matchType": "casual",
  "skillLevel": "beginner",
  "location": {
    "address": "Central Park",
    "city": "New York",
    "latitude": 40.7829,
    "longitude": -73.9654
  },
  "duration": 120,
  "ground": "Central Field"
}
```

#### 2. Get All Matches
```bash
GET /matches?sport=cricket&city=New York&status=upcoming&page=1&limit=10
```

#### 3. Join Match
```bash
POST /matches/{matchId}/join
Authorization: Bearer {{token}}
```

#### 4. Get Profile
```bash
GET /auth/profile
Authorization: Bearer {{token}}
```

#### 5. Update Profile
```bash
PUT /auth/profile
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Name",
  "bio": "Sports enthusiast",
  "skillLevel": "intermediate",
  "sportPreferences": ["cricket", "football", "badminton"]
}
```

## 📁 Project Structure

```
PlayConnect/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & config
│   │   ├── controllers/     # API logic
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & error handling
│   │   └── server.js        # Entry point
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API calls
│   │   ├── context/         # State management
│   │   ├── hooks/           # Custom hooks
│   │   └── App.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
│
├── docs/
│   └── DATABASE_SCHEMA.md   # Database design
│
└── README.md                # This file
```

## 🔄 Full Feature Flow

### User Signup Flow
1. User fills signup form
2. Frontend sends to `/api/auth/signup`
3. Backend validates input
4. Password hashed with bcrypt
5. User created in MongoDB
6. JWT token generated
7. Token & user data returned
8. Frontend stores token in localStorage
9. Redirects to homepage

### Match Flow
1. User clicks "Create Match"
2. Fills match details
3. Backend validates
4. Match created with user as host
5. Match appears in list
6. Other users can join
7. When full, no more joins allowed

### Join Match Flow
1. User views match details
2. Clicks "Join Match"
3. Backend checks if user already joined
4. Checks if match is full
5. Adds user to match
6. Updates player count
7. User stats updated
8. Other users get updated list

## 🛠️ Development Commands

### Backend
```bash
cd backend

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

### Frontend
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📚 Key Features

### ✅ Implemented
- User Authentication (JWT)
- Match Creation & Management
- Join/Leave Matches
- User Profiles
- Sport Filtering
- Location Display
- Pagination
- Error Handling
- Input Validation
- Password Hashing

### 🔜 Ready to Implement
- Real-time Updates (Socket.io - already installed)
- Chat System
- Google Maps Integration
- User Ratings & Reviews
- Payment Processing
- Email Notifications
- Photo Uploads

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB Connection Error: connection refused
```
**Solution:**
- Check if MongoDB is running: `mongod`
- Check connection string in .env
- For Atlas, whitelist your IP address

### Port Already in Use
```
Error: Port 5000 already in use
```
**Solution:**
```bash
# Find process using port (Windows)
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID {PID} /F

# macOS/Linux
sudo lsof -i :5000
kill -9 {PID}
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Verify FRONTEND_URL in backend .env
- Check that backend is running
- Verify Backend CORS configuration

### Token Expired
```
401 Unauthorized: Invalid or expired token
```
**Solution:**
- Clear localStorage: `localStorage.clear()`
- Login again
- Copy new token

### Blank Frontend Page
```
Vite HMR Error or Cannot find Tailwind styles
```
**Solution:**
```bash
# Clear node_modules
rm -rf node_modules

# Reinstall
npm install

# Restart
npm run dev
```

## 📦 Deploy to Production

### Backend Deployment (Render)

1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create new service
4. Connect GitHub repo (backend folder)
5. Set environment variables:
   - `NODE_ENV=production`
   - `MONGODB_ATLAS_URI=your_atlas_uri`
   - `JWT_SECRET=strong_secret_key`
   - `FRONTEND_URL=your_frontend_url`
6. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import project (frontend folder)
4. Set environment variable:
   - `VITE_API_BASE_URL=your_backend_url/api`
5. Deploy

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT Guide](https://jwt.io/)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/name`
5. Create Pull Request

## 📞 Support

For issues or questions:
1. Check existing issues
2. Check troubleshooting section
3. Create new issue with details

## 📄 License

MIT License - Feel free to use for educational purposes

---

**Happy Coding! 🚀**

For detailed backend documentation, see [backend/README.md](./backend/README.md)
For detailed frontend documentation, see [frontend/README.md](./frontend/README.md)
