# 🚀 PlayConnect - Quick Start Runbook

## ⚡ 5-Minute Quick Start

### Prerequisites Check
```bash
# Check Node.js version
node --version      # Should be v14+

# Check npm version
npm --version       # Should be v6+
```

### Step 1: Start MongoDB (Choose One)

**Option A: Local MongoDB**
```powershell
# Windows - Start MongoDB service
net start MongoDB

# Verify it's running
mongosh --eval "db.version()"
```

**Option B: MongoDB Atlas (Cloud)**
- Already have URI? Skip to Step 2
- No URI? Get it from mongosh connection string

### Step 2: Start Backend

```powershell
# Terminal 1
cd backend
npm install      # First time only
npm run dev

# Wait for message:
# ✅ MongoDB Connected
# 🎯 Server Running on PORT 5000
```

### Step 3: Start Frontend

```powershell
# Terminal 2
cd frontend
npm install      # First time only
npm run dev

# Wait for message:
# ➜ Local: http://localhost:3000/
```

### Step 4: Access Application

1. Open http://localhost:3000 in your browser
2. Click "Sign Up"
3. Fill in test data:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Password: password123
   - City: New York
4. Create account
5. Create first match on home screen!

---

## 🔥 Common Commands

### Backend Operations
```powershell
# Start development server
cd backend && npm run dev

# Start production server
npm start

# Install dependencies
npm install

# View logs in real-time
npm run dev   # Already shows logs
```

### Frontend Operations
```powershell
# Start development server
cd frontend && npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

### Database Operations
```powershell
# Connect to MongoDB Shell
mongosh

# Commands inside mongosh:
use playconnect                  # Switch to DB
db.users.countDocuments()        # Count users
db.matches.countDocuments()      # Count matches
db.users.find().limit(1)         # See first user
db.matches.deleteMany({})        # Clear matches
```

---

## ✅ Verification Checklist

Run through this after installation:

- [ ] MongoDB running? `mongosh --eval "db.version()"`
- [ ] Backend running? http://localhost:5000/health → `{"success":true}`
- [ ] Frontend running? http://localhost:3000 → Login page visible
- [ ] Can create account? Signup with test data
- [ ] Can create match? Go to Home → Create Match
- [ ] Can view matches? Matches appear on home page
- [ ] Can join match? Click match → Join button works

---

## 🧪 Test Scenarios

### Scenario 1: Create Account → Create Match
```
1. Go to http://localhost:3000
2. Click Sign Up
3. Fill form (name, email, phone, password, city)
4. Submit
5. Logged in ✓
6. Click Create Match
7. Fill match form
8. Submit
9. Match created ✓
```

### Scenario 2: Multiple Users → Join Match
```
1. Create Account 1 (user1@test.com)
2. Create Match "Cricket Game"
3. Logout
4. Create Account 2 (user2@test.com)
5. Home page shows "Cricket Game"
6. Click → Join Match ✓
7. View match → Shows 2 players ✓
```

### Scenario 3: Filter Matches
```
1. Logged in
2. Home shows all matches
3. Select Sport: cricket
4. Shows only cricket matches ✓
5. Enter City: "Boston"
6. Shows cricket in Boston ✓
```

---

## 🐛 Quick Troubleshooting

### Backend won't start
```powershell
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process using port
taskkill /PID {PID} /F

# Try again
npm run dev
```

### Frontend won't start
```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process
taskkill /PID {PID} /F

# Clear cache and restart
rm -r node_modules
npm install
npm run dev
```

### Database connection error
```powershell
# Check MongoDB status
mongosh --eval "db.adminCommand('ping')"

# If not running, start it
net start MongoDB    # Windows
brew services start mongodb-community  # macOS

# Try again
npm run dev
```

### CORS error in console
```
❌ Cross-Origin Request Blocked

→ Check FRONTEND_URL in backend/.env
→ Should be http://localhost:3000
→ Restart backend: npm run dev
```

### Token expired error
```
❌ 401 Unauthorized

→ Logout and login again
→ Clear browser cache
→ Try in incognito window
```

---

## 📊 Expected Performance

| Operation | Time Expected |
|-----------|---|
| Backend startup | <2 seconds |
| Frontend startup | <3 seconds |
| API Response | <100ms |
| Create Match | <500ms |
| Join Match | <300ms |
| List Matches | <200ms |

---

## 💾 Sample Test Data

### User 1
```
Name: John Smith
Email: john@test.com
Phone: 9876543210
Password: password123
City: New York
Sports: cricket, football
```

### User 2
```
Name: Jane Doe
Email: jane@test.com
Phone: 9876543211
Password: password123
City: Boston
Sports: badminton, basketball
```

### Match 1
```
Title: Sunday Cricket Match
Sport: cricket
City: New York
Players: 11
Date: Tomorrow at 14:00
```

---

## 🔄 Development Workflow

### Day 1: Setup & Testing
1. Install dependencies
2. Start MongoDB
3. Run backend: `npm run dev`
4. Run frontend: `npm run dev`
5. Create test user
6. Create test match
7. Test all features

### Ongoing Development
1. Make code changes
2. Frontend auto-reloads on save
3. Backend auto-reloads on save (nodemon)
4. Test changes in browser
5. Check console for errors

---

## 📱 Browser DevTools Tips

### Check API Calls
```
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action (create match, etc.)
4. See API request/response
5. Check headers, payload, response
```

### Check Local Storage
```
1. Open DevTools (F12)
2. Go to Application tab
3. LocalStorage → http://localhost:3000
4. See stored token and user data
5. Can delete to logout
```

### Check Console
```
1. Open DevTools (F12)
2. Go to Console tab
3. See errors and logs
4. Can run JavaScript commands
5. Type: localStorage.getItem('token')
```

---

## ⚙️ Environment Files

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_LOCAL_URI=mongodb://localhost:27017/playconnect
JWT_SECRET=playconnect_super_secret_key_2024_development_only
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_IO_URL=http://localhost:5000
```

---

## 🎓 What to Study Next

### If New to MERN:
1. Express.js middleware
2. MongoDB relationships
3. React hooks
4. JWT authentication
5. RESTful API design

### If Building Features:
1. Check existing code structure
2. Follow same patterns
3. Use existing hooks/services
4. Test with Postman first
5. Then test in frontend

---

## 📞 Getting Help

### Check These First:
1. Browser console for errors (F12)
2. Backend terminal for logs
3. MongoDB connection status
4. Port conflicts (5000, 3000)
5. .env file configuration

### Then Ask:
1. Stack Overflow
2. GitHub Issues
3. Documentation
4. Chat sites (Stack Overflow)

---

## 🎯 Next Steps

### Immediate (This Session)
- [ ] Get everything running
- [ ] Test signup/login
- [ ] Create and join a match
- [ ] View profile

### Short Term (Next Few Hours)
- [ ] Read DATABASE_SCHEMA.md
- [ ] Test Postman API calls
- [ ] Modify a component
- [ ] Customize styling

### Later (Next Few Days)
- [ ] Add a new feature
- [ ] Deploy to production
- [ ] Set up CI/CD
- [ ] Add unit tests

---

## 📈 Performance Optimization

### Frontend
```bash
npm run build      # Creates optimized bundle
npm run preview    # Test production build locally
```

### Backend
```bash
export NODE_ENV=production
npm start
```

### Database
- Indexes already created
- Geospatial queries optimized
- Pagination implemented

---

## 🚀 Ready to Deploy?

See SETUP_GUIDE.md section: **Deploy to Production**

```
Backend → Render.com
Frontend → Vercel.com
```

---

## 📞 Emergency Commands

If everything breaks:

```powershell
# Kill all node processes
taskkill /F /IM node.exe

# Clear everything
rm -r backend/node_modules frontend/node_modules
rm backend/package-lock.json frontend/package-lock.json

# Reinstall
cd backend && npm install && npm run dev
# New terminal
cd frontend && npm install && npm run dev
```

---

## ✨ Pro Tips

1. **Use Postman** - Test API before frontend
2. **Check Localhost** - Always verify services are running
3. **Read Errors** - Most errors tell you exactly what's wrong
4. **Use Browser DevTools** - Network tab is your friend
5. **Save Often** - Auto-reload is great but save anyway!

---

**Time to Complete:** ~5-10 minutes for setup + testing

**Ready? Let's Go! 🎯**

For more details, see the full documentation in the project root.
