# PlayConnect Frontend

This is the frontend for PlayConnect, a sports matchmaking platform built with React, Vite, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
   - Create a `.env` file (or copy from `.env.example`)
   - Update API endpoint if backend is running on different port

4. **Start development server:**
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── UI.jsx           # Button, Input, Card, etc.
│   ├── context/             # Context API
│   │   └── AuthContext.jsx  # Auth state management
│   ├── hooks/               # Custom React hooks
│   │   └── useMatches.js
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── MatchDetailPage.jsx
│   │   ├── CreateMatchPage.jsx
│   │   └── ProfilePage.jsx
│   ├── services/            # API services
│   │   └── api.js           # Axios configuration
│   ├── styles/              # CSS files
│   │   └── globals.css      # Tailwind imports
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env                     # Environment variables
├── .gitignore
└── package.json
```

## 🔑 Environment Variables

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_IO_URL=http://localhost:5000
```

## 📄 Pages

### 1. **Login Page** (`/login`)
- User login with email and password
- Link to signup
- Demo credentials display

### 2. **Signup Page** (`/signup`)
- User registration
- Sport preferences selection
- Location information
- Password confirmation

### 3. **Home/Dashboard** (`/`)
- List of all matches
- Filter by sport and city
- View match details
- Pagination
- Create match button

### 4. **Match Detail** (`/matches/:matchId`)
- Match information
- Players list
- Join/Leave match logic
- Host information
- Location on geospatial map (ready)

### 5. **Create Match** (`/create-match`)
- Form to create new match
- All match details
- Location input
- Date and time picker

### 6. **Profile** (`/profile`)
- User profile information
- Edit profile
- Sport preferences
- Skill level
- Stats (matches hosted/joined, rating)

## 🎨 Components

### UI Components (`components/UI.jsx`)
- `Button` - Reusable button with variants
- `Card` - Container component
- `Input` - Text input with error display
- `Select` - Dropdown select
- `Spinner` - Loading spinner
- `Alert` - Alert messages
- `Badge` - Status badges
- `Modal` - Modal dialog
- `Pagination` - Pagination component

### Navbar (`components/Navbar.jsx`)
- Navigation menu
- User profile dropdown
- Login/Signup links
- Mobile responsive menu

### Protected Route (`components/ProtectedRoute.jsx`)
- Route protection
- Redirect to login if not authenticated
- Loading state handling

## 🔐 Authentication Flow

1. User signs up/logs in
2. JWT token received from backend
3. Token stored in localStorage
4. Token automatically sent with API requests
5. Token validated on protected routes
6. Logout clears token and user data

## 🌐 API Integration

### API Service (`services/api.js`)
- Axios instance with automatic token injection
- Base URL configuration
- Response interceptors for error handling
- 401 auto-logout on token expiry

### Features
- **Auth API**: signup, login, profile, update profile
- **Match API**: create, list, get, join, leave, nearby, search

## ⚙️ State Management

### Auth Context
- User state
- Token state
- Authentication functions (signup, login, logout)
- Profile update
- Loading and error states

### Custom Hooks
- `useMatches()` - Fetch matches with filters
- `useMatch()` - Fetch single match
- `useNearbyMatches()` - Location-based match search

## 🧹 Build & Deploy

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist` folder.

### Preview Production Build
```bash
npm run preview
```

## 📦 Key Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icons
- **Socket.io** - Ready for real-time features

## 🚀 Deployment

### Option 1: Vercel
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm run build
# Deploy dist folder to Netlify
```

### Option 3: GitHub Pages
```bash
npm run build
# Push dist folder to gh-pages branch
```

## 📝 Development Tips

1. **Hot Module Replacement (HMR)** - Changes auto-reload
2. **Fast Refresh** - React components update without losing state
3. **Debugging** - Use React DevTools browser extension
4. **API Testing** - Use Postman to test backend API
5. **Responsive Design** - Test on mobile devices

## 🔍 Testing Credentials

After creating a test user:
```
Email: test@example.com
Password: password123
```

## 🤝 Features Implemented

✅ User Authentication (Signup/Login)
✅ Match Creation & Listing
✅ Join/Leave Matches
✅ User Profile
✅ Sport Filtering
✅ Location Display
✅ Responsive Design
✅ Error Handling
✅ Loading States
✅ Form Validation

## 🔜 Future Enhancements

- Real-time notifications (Socket.io)
- Chat between players
- Google Maps integration
- User ratings and reviews
- Match history
- Photo uploads
- Advanced filtering
- Payment integration

## 🐛 Troubleshooting

### API Connection Error
- Check if backend is running on port 5000
- Verify `VITE_API_BASE_URL` in .env
- Check CORS settings in backend

### Auth Token Issues
- Clear localStorage and re-login
- Check token expiration
- Verify JWT_SECRET matches backend

### Styling Not Applied
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Clear Tailwind cache: `rm -rf .parcel-cache`

---

**Last Updated:** March 19, 2024
