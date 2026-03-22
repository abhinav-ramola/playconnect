# PlayConnect Backend

This is the backend server for PlayConnect, a sports matchmaking platform built with Node.js, Express, and MongoDB.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
   - Copy `.env.example` to `.env`
   - Update the values (MongoDB URI, JWT secret, etc.)

4. **Ensure MongoDB is running:**
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Update the URI in `.env`

5. **Start the server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── config.js    # Environment variables
│   │   └── database.js  # MongoDB connection
│   ├── controllers/     # Request handlers
│   │   ├── authController.js
│   │   └── matchController.js
│   ├── middleware/      # Express middleware
│   │   └── auth.js      # JWT authentication
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   └── Match.js
│   ├── routes/          # API routes
│   │   ├── authRoutes.js
│   │   └── matchRoutes.js
│   ├── utils/           # Utility functions
│   │   ├── jwt.js
│   │   └── response.js
│   ├── validators/      # Input validation
│   │   └── inputValidator.js
│   └── server.js        # Entry point
├── .env                 # Environment variables (local)
├── .env.example         # Environment template
├── .gitignore
└── package.json
```

## 🔐 Authentication

### Signup
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "city": "New York",
  "state": "NY",
  "address": "123 Main St",
  "sportPreferences": ["cricket", "football"]
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User Profile
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

### Update Profile
```bash
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe Updated",
  "bio": "Sports enthusiast",
  "sportPreferences": ["cricket", "football", "badminton"],
  "skillLevel": "intermediate"
}
```

## 🏟️ Match APIs

### Create Match
```bash
POST /api/matches
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Cricket Match - Sunday",
  "description": "Friendly cricket match",
  "sport": "cricket",
  "playersNeeded": 11,
  "matchDate": "2024-03-25T14:00:00Z",
  "location": {
    "address": "Central Park",
    "city": "New York",
    "latitude": 40.7829,
    "longitude": -73.9654
  },
  "matchType": "casual",
  "skillLevel": "beginner",
  "duration": 120,
  "ground": "Central Field"
}
```

### Get All Matches
```bash
GET /api/matches?sport=cricket&city=New York&status=upcoming&page=1&limit=10
```

### Get Match by ID
```bash
GET /api/matches/:matchId
```

### Join Match
```bash
POST /api/matches/:matchId/join
Authorization: Bearer <token>
```

### Leave Match
```bash
POST /api/matches/:matchId/leave
Authorization: Bearer <token>
```

### Update Match Status
```bash
PUT /api/matches/:matchId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

### Get Nearby Matches
```bash
GET /api/matches/nearby?longitude=73.9654&latitude=40.7829&maxDistance=10000
```

### Search Matches
```bash
GET /api/matches/search?query=cricket
```

### Delete Match
```bash
DELETE /api/matches/:matchId
Authorization: Bearer <token>
```

## 🗃️ Database Models

### User Schema
- firstName, lastName
- email (unique)
- phone
- password (hashed)
- location (address, city, coordinates)
- sportPreferences
- skillLevel
- matchesHosted, matchesJoined
- rating
- isVerified

### Match Schema
- title, description
- sport (cricket, football, badminton, etc.)
- hostedBy (User reference)
- playersNeeded, playersJoined (array of User references)
- location (address, coordinates)
- matchDate, duration
- status (upcoming, ongoing, completed, cancelled)
- matchType (casual, competitive, tournament)
- entryFee
- skillLevel

## 🔧 Environment Variables

```
PORT                    # Server port (default: 5000)
NODE_ENV               # Environment (development/production)
MONGODB_LOCAL_URI      # Local MongoDB connection string
MONGODB_ATLAS_URI      # MongoDB Atlas connection string
JWT_SECRET             # Secret key for JWT token generation
JWT_EXPIRE             # Token expiration time
FRONTEND_URL           # Frontend application URL
SOCKET_IO_CORS_ORIGIN # Socket.io CORS origin
```

## 🤝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "error details"
}
```

## 📝 Notes

- All authenticated requests require JWT token in Authorization header
- Token format: `Authorization: Bearer <token>`
- Passwords are hashed using bcrypt
- Location-based queries use MongoDB geospatial indexes
- CORS is configured for frontend URL

## 🚢 Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Update `JWT_SECRET` with a strong secret
3. Configure MongoDB Atlas URI
4. Deploy to services like Render, Railway, or Heroku

## 📚 Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Socket.io** - Real-time communication (ready)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check Atlas URI
- Verify network access for Atlas

### JWT Token Error
- Clear old tokens and re-login
- Check JWT_SECRET configuration

### CORS Error
- Update FRONTEND_URL in .env
- Check browser console for specific CORS errors

---

**Last Updated:** March 19, 2024
