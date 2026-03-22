import express from 'express';
import { signup, login, getCurrentUser, updateProfile, getUserById, uploadProfilePicture } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);
router.post('/profile/avatar', authenticateToken, uploadProfilePicture);
router.get('/user/:userId', getUserById);

export default router;
