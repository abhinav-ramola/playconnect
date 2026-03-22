import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">🎯 PlayConnect</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
                                Matches
                            </Link>
                            <Link to="/create-match" className="text-gray-600 hover:text-blue-600">
                                Create Match
                            </Link>
                            <Link to="/profile" className="text-gray-600 hover:text-blue-600">
                                My Profile
                            </Link>
                            <div className="flex items-center gap-3 border-l pl-6">
                                <img src={user?.profilePicture || 'https://via.placeholder.com/40'} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                                <span className="text-sm font-medium">{user?.firstName}</span>
                            </div>
                            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-blue-600">
                                Login
                            </Link>
                            <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-50 border-t p-4 space-y-3">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="block text-gray-600 hover:text-blue-600 font-medium">
                                Matches
                            </Link>
                            <Link to="/create-match" className="block text-gray-600 hover:text-blue-600 font-medium">
                                Create Match
                            </Link>
                            <Link to="/profile" className="block text-gray-600 hover:text-blue-600 font-medium">
                                My Profile
                            </Link>
                            <button onClick={handleLogout} className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block text-gray-600 hover:text-blue-600 font-medium">
                                Login
                            </Link>
                            <Link to="/signup" className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};
