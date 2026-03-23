import express from 'express';
import {
    createMatch,
    getAllMatches,
    getMatchById,
    joinMatch,
    leaveMatch,
    updateMatchStatus,
    updateMatch,
    getNearbyMatches,
    searchMatches,
    deleteMatch,
    getUserMatches,
    getUserProfile,
} from '../controllers/matchController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (more specific - must come before generic ones)
router.get('/user/matches', authenticateToken, getUserMatches);
router.post('/', authenticateToken, createMatch);

// Public routes
router.get('/search', searchMatches);
router.get('/nearby', getNearbyMatches);
router.get('/profile/:userId', getUserProfile);

// Main list (must come before :matchId routes)
router.get('/', getAllMatches);

// Protected routes (must come after specific routes)
router.get('/:matchId', getMatchById);
router.put('/:matchId', authenticateToken, updateMatch);
router.patch('/:matchId/status', authenticateToken, updateMatchStatus);
router.put('/:matchId/status', authenticateToken, updateMatchStatus);
router.post('/:matchId/join', authenticateToken, joinMatch);
router.post('/:matchId/leave', authenticateToken, leaveMatch);
router.delete('/:matchId', authenticateToken, deleteMatch);

export default router;
