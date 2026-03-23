import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    uploadProfilePicture: (data) => api.post('/auth/profile/avatar', data),
    getUserById: (userId) => api.get(`/auth/user/${userId}`),
};

// Match APIs
export const matchAPI = {
    createMatch: (data) => api.post('/matches', data),
    getAllMatches: (params) => api.get('/matches', { params }),
    getMatchById: (matchId) => api.get(`/matches/${matchId}`),
    updateMatch: (matchId, data) => api.put(`/matches/${matchId}`, data),
    joinMatch: (matchId) => api.post(`/matches/${matchId}/join`),
    leaveMatch: (matchId) => api.post(`/matches/${matchId}/leave`),
    updateMatchStatus: (matchId, data) => api.patch(`/matches/${matchId}/status`, data),
    getNearbyMatches: (params) => api.get('/matches/nearby', { params }),
    searchMatches: (params) => api.get('/matches/search', { params }),
    deleteMatch: (matchId) => api.delete(`/matches/${matchId}`),
    getUserMatches: () => api.get('/matches/user/matches'),
    getUserProfile: (userId) => api.get(`/matches/profile/${userId}`),
    submitReview: (matchId, playerId, data) => api.post(`/reviews/${matchId}/review/${playerId}`, data),
};

// Review APIs
export const reviewAPI = {
    submitReview: (matchId, playerId, data) => api.post(`/reviews/${matchId}/review/${playerId}`, data),
    getMatchReviews: (matchId) => api.get(`/reviews/${matchId}/reviews`),
};

// Export api instance for direct use
export { api };

export default api;
