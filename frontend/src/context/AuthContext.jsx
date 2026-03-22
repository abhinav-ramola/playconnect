import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    // Signup handler
    const signup = async (data) => {
        try {
            setError(null);
            const response = await authAPI.signup(data);
            const { user: userData, token: newToken } = response.data.data;

            setUser(userData);
            setToken(newToken);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
            throw err;
        }
    };

    // Login handler
    const login = async (data) => {
        try {
            setError(null);
            const response = await authAPI.login(data);
            const { user: userData, token: newToken } = response.data.data;

            setUser(userData);
            setToken(newToken);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    // Logout handler
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // Update profile
    const updateProfile = async (data) => {
        try {
            setError(null);
            const response = await authAPI.updateProfile(data);
            const updatedUser = response.data.data;

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
            throw err;
        }
    };

    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated: !!token,
        signup,
        login,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
