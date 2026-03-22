# 🗂️ PlayConnect - Developer Quick Reference

## 🚀 Start Here

```bash
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Frontend
cd frontend && npm install && npm run dev

# Then go to: http://localhost:3000
```

---

## 📍 File Locations

### Backend Key Files
```
backend/
├── server.js              → Entry point - Main Express app
├── models/User.js         → User schema with methods
├── models/Match.js        → Match schema with methods
├── controllers/*.js       → API logic (signup, create match, etc)
├── routes/*.js            → API endpoints
├── middleware/auth.js     → JWT authentication
├── config/database.js     → MongoDB connection
└── .env                   → Environment variables
```

### Frontend Key Files
```
frontend/
├── App.jsx                → Main app with routing
├── main.jsx               → React entry point
├── context/AuthContext.jsx → Auth state management
├── pages/*.jsx            → Page components
├── components/UI.jsx      → Reusable UI components
├── services/api.js        → Axios API client setup
└── .env                   → Environment variables
```

---

## 🔐 Authentication Flow

```javascript
// 1. User signs up
POST /api/auth/signup
Body: { firstName, lastName, email, phone, password, city }
Response: { user, token }

// 2. Token stored in localStorage
localStorage.setItem('token', token)

// 3. Token sent with all auth requests
Headers: { Authorization: 'Bearer token' }

// 4. Backend verifies token in middleware
middleware/auth.js → authenticateToken()

// 5. Access current user
GET /api/auth/profile
Headers: { Authorization: 'Bearer token' }
```

---

## 🏟️ Match System Flow

```javascript
// 1. Create match
POST /api/matches
Body: { title, sport, playersNeeded, matchDate, location, ... }
Response: { match with host as first player }

// 2. Get all matches
GET /api/matches?sport=cricket&city=NewYork&page=1&limit=10

// 3. Join match
POST /api/matches/:matchId/join
Preconditions: User not host, Match not full, Not already joined

// 4. Leave match
POST /api/matches/:matchId/leave
Preconditions: User is joined, User is not host

// 5. Update match status
PUT /api/matches/:matchId/status
Body: { status: 'completed' }
Preconditions: User is host
```

---

## 🧪 API Testing (Postman)

### Headers for Protected Endpoints
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Test Signup
```bash
POST http://localhost:5000/api/auth/signup

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@test.com",
  "phone": "9876543210",
  "password": "password123",
  "city": "New York"
}
```

### Test Create Match
```bash
POST http://localhost:5000/api/matches
Authorization: Bearer <token>

{
  "title": "Sunday Cricket",
  "sport": "cricket",
  "playersNeeded": 11,
  "matchDate": "2024-03-31T14:00:00Z",
  "location": {
    "address": "Central Park",
    "city": "New York",
    "latitude": 40.7829,
    "longitude": -73.9654
  }
}
```

### Test Join Match
```bash
POST http://localhost:5000/api/matches/matchId/join
Authorization: Bearer <token>
# No body needed
```

---

## 🎨 Frontend Component Structure

### Page Components (in src/pages/)
- `LoginPage.jsx` → Login form, navigation to signup
- `SignupPage.jsx` → Registration form with sports selection
- `HomePage.jsx` → List matches with filters
- `MatchDetailPage.jsx` → Match info, players list, join button
- `CreateMatchPage.jsx` → Form to create new match
- `ProfilePage.jsx` → User profile, stats, edit info

### UI Components (in src/components/UI.jsx)
```javascript
<Button variant="primary|secondary|danger" />
<Input label="..." type="..." />
<Select label="..." options={[]} />
<Card>content</Card>
<Alert type="success|error|warning" />
<Badge variant="primary|success" />
<Spinner size="sm|md|lg" />
<Modal isOpen={bool} title="..." onClose={fn}/>
```

### Context (in src/context/)
```javascript
const { user, token, isAuthenticated, signup, login, logout } = useAuth()
```

### Hooks (in src/hooks/)
```javascript
const { matches, loading, error, pagination } = useMatches()
const { match, loading, error } = useMatch(matchId)
const { matches, loading, fetchNearbyMatches } = useNearbyMatches()
```

---

## 🗄️ Database Quick Reference

### User Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  email: String (unique),
  password: String (hashed),
  location: { city, coordinates: [lon, lat] },
  sportPreferences: [String],
  skillLevel: String,
  matchesHosted: Number,
  matchesJoined: Number,
  rating: Number,
  createdAt: Date
}
```

### Match Collection
```javascript
{
  _id: ObjectId,
  title: String,
  sport: String (cricket|football|etc),
  hostedBy: ObjectId (ref: User),
  playersJoined: [{ player: ObjectId, joinedAt: Date }],
  playersNeeded: Number,
  location: { address, city, coordinates: [lon, lat] },
  matchDate: Date,
  status: String (upcoming|completed|cancelled),
  createdAt: Date
}
```

### Useful Query Examples
```javascript
// Find upcoming matches
db.matches.find({ status: 'upcoming', matchDate: { $gte: new Date() } })

// Find matches by host
db.matches.find({ hostedBy: userId })

// Find matches user joined
db.matches.find({ 'playersJoined.player': userId })

// Check if user joined
db.matches.findOne({ _id: matchId, 'playersJoined.player': userId })

// Count players in match
db.matches.findById(matchId).select('playersJoined')
```

---

## 🛠️ Common Tasks

### Add New API Endpoint

1. **Create model method** (if needed) in `models/Match.js` or `models/User.js`
   ```javascript
   matchSchema.methods.myNewMethod = function() { ... }
   ```

2. **Create controller** in `controllers/matchController.js`
   ```javascript
   export const myNewEndpoint = async (req, res) => {
     try {
       // Logic here
       return sendSuccess(res, data, 'Success');
     } catch (error) {
       return sendError(res, error.message, 500);
     }
   }
   ```

3. **Add route** in `routes/matchRoutes.js`
   ```javascript
   router.post('/new-endpoint', authenticateToken, myNewEndpoint)
   ```

### Add New Frontend Page

1. **Create page component** in `src/pages/NewPage.jsx`
   ```javascript
   export const NewPage = () => {
     return <div>New Page</div>
   }
   ```

2. **Add route** in `App.jsx`
   ```javascript
   <Route path="/new" element={<NewPage />} />
   ```

3. **Add link** in `Navbar.jsx`
   ```javascript
   <Link to="/new">New Page</Link>
   ```

---

## 🐛 Debugging Quick Tips

### Check if Backend is Running
```bash
# Should return 200 OK
curl http://localhost:5000/health
```

### Check if Frontend is Running
```bash
# Should show React app
curl http://localhost:3000
```

### View Backend Logs
```bash
# Logs show in terminal where you ran: npm run dev
# Shows API calls, database queries, errors
```

### View Frontend Logs
```bash
# Check browser console: F12 → Console tab
# Or terminal where you ran: npm run dev
```

### View Network Requests
```bash
# In browser: F12 → Network tab
# Shows all API calls, request/response
```

### View Local Storage
```bash
# In browser: F12 → Application → Local Storage
# See token and user data
```

---

## ⚙️ Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_LOCAL_URI=mongodb://localhost:27017/playconnect
JWT_SECRET=development_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_IO_URL=http://localhost:5000
```

---

## 🔄 Common Workflows

### Create a Match (Full Flow)

1. **Frontend** - User fills form in `CreateMatchPage.jsx`
2. **Frontend** - Click submit → `matchAPI.createMatch(data)`
3. **Backend** - Route receives `POST /api/matches`
4. **Backend** - `matchController.createMatch()` validates & creates
5. **Backend** - MongoDB saves match document
6. **Backend** - Returns match with populated references
7. **Frontend** - Redirect to match detail page
8. **Frontend** - Show success message

### Join a Match (Full Flow)

1. **Frontend** - User clicks join button in `MatchDetailPage.jsx`
2. **Frontend** - Calls `matchAPI.joinMatch(matchId)`
3. **Backend** - Route receives `POST /api/matches/:matchId/join`
4. **Backend** - `matchController.joinMatch()` runs
5. **Backend** - Validates: user not host, match not full, not already joined
6. **Backend** - Adds user to playersJoined array
7. **Backend** - Updates user matchesJoined count
8. **Backend** - Returns updated match
9. **Frontend** - Updates UI with new player list
10. **Frontend** - Join button changes to Leave button

---

## 📊 Performance Tips

### Database Queries
- Use `.select()` to limit fields returned
- Use `.lean()` for read-only queries
- Use `.pagination()` for large datasets
- Use `.index()` for frequently searched fields

### Frontend
- Lazy load images
- Use `useMemo()` for expensive calculations
- Keep component state small
- Use React DevTools Profiler

### Network
- Use pagination for lists
- Implement request debouncing
- Cache API responses
- Compress images

---

## 🚀 Before Deployment

### Backend Checklist
- [ ] Change JWT_SECRET to random 32+ char string
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas (not local)
- [ ] Test all API endpoints
- [ ] Setup error logging
- [ ] Enable CORS properly

### Frontend Checklist
- [ ] Update VITE_API_BASE_URL to production backend
- [ ] Run `npm run build`
- [ ] Test production build locally: `npm run preview`
- [ ] Test on mobile devices
- [ ] Check all images load
- [ ] Verify all links work

### Database Checklist
- [ ] Enable MongoDB authentication
- [ ] Backup existing data
- [ ] Setup automated backups
- [ ] Test restore process
- [ ] Create admin user
- [ ] Setup monitoring

---

## 📱 Responsive Design Tests

```
- [ ] Desktop (1920px) - All features work
- [ ] Tablet (768px) - Menu collapses, responsive layout
- [ ] Mobile (375px) - Touch-friendly buttons, stacked layout
- [ ] Test on Chrome, Firefox, Safari, Edge
```

---

## 💡 Useful Commands

```bash
# Backend
npm run dev         # Start with auto-reload
npm start           # Start production

# Frontend
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Test production build

# Database
mongosh             # Connect to MongoDB shell
```

---

## 🎯 Most Important Files

**If you only knew these 5 files:**
1. `backend/src/server.js` - Main Express app
2. `backend/src/controllers/authController.js` - User logic
3. `backend/src/controllers/matchController.js` - Match logic
4. `frontend/src/App.jsx` - React routing
5. `frontend/src/context/AuthContext.jsx` - Auth state

---

## 📞 Getting Help

### When stuck:
1. Check console (F12)
2. Check backend logs (terminal)
3. Check network tab (F12)
4. Check environment variables
5. Read error message carefully
6. Google the error
7. Check documentation

### Resources:
- Express Docs: https://expressjs.com/
- MongoDB Docs: https://docs.mongodb.com/
- React Docs: https://react.dev/
- Tailwind Docs: https://tailwindcss.com/

---

## 🎓 Next Learning Steps

1. **Learn WebSockets** - Implement real-time socket.io
2. **Learn Testing** - Add Jest tests
3. **Learn DevOps** - Setup CI/CD with GitHub Actions
4. **Learn Scaling** - Redis caching, database sharding
5. **Learn Security** - OWASP standards, security audits

---

**Happy Coding! 🎯**

Print this page for quick reference while developing!
