import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    completeMatch,
    submitReview,
    getPlayerProfile,
    getMatchReviews,
} from '../controllers/reviewController.js';

const router = express.Router();

// Complete a match
router.put('/:matchId/complete', authenticateToken, completeMatch);

// Submit a review for a player
router.post('/:matchId/review/:reviewedPlayerId', authenticateToken, submitReview);

// Get all reviews for a match
router.get('/:matchId/reviews', getMatchReviews);

// Get player profile with history and reviews
router.get('/player/:playerId', getPlayerProfile);

export default router;
