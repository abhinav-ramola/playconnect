import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { NotificationContainer } from './components/NotificationContainer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { HomePage } from './pages/HomePage';
import { MatchDetailPage } from './pages/MatchDetailPage';
import { CreateMatchPage } from './pages/CreateMatchPage';
import { ProfilePage } from './pages/ProfilePage';
import { EnhancedProfilePage } from './pages/EnhancedProfilePage';

// Styles
import './styles/globals.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <NotificationProvider>
                    <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <NotificationContainer />
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />

                            {/* Protected Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <HomePage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/matches/:matchId"
                                element={
                                    <ProtectedRoute>
                                        <MatchDetailPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/create-match"
                                element={
                                    <ProtectedRoute>
                                        <CreateMatchPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/player/:playerId"
                                element={
                                    <ProtectedRoute>
                                        <EnhancedProfilePage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/profile/:playerId"
                                element={
                                    <ProtectedRoute>
                                        <EnhancedProfilePage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Catch all - redirect to home */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </NotificationProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
