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
} from '../controllers/matchController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllMatches);
router.get('/search', searchMatches);
router.get('/nearby', getNearbyMatches);
router.get('/:matchId', getMatchById);

// Protected routes
router.post('/', authenticateToken, createMatch);
router.put('/:matchId', authenticateToken, updateMatch);
router.put('/:matchId/status', authenticateToken, updateMatchStatus);
router.post('/:matchId/join', authenticateToken, joinMatch);
router.post('/:matchId/leave', authenticateToken, leaveMatch);
router.delete('/:matchId', authenticateToken, deleteMatch);

export default router;
