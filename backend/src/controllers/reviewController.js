import Review from '../models/Review.js';
import Match from '../models/Match.js';
import User from '../models/User.js';

// Complete a match and get reviewing status
export const completeMatch = async (req, res) => {
    try {
        const { matchId } = req.params;
        const { result, description } = req.body;

        // Find match
        const match = await Match.findById(matchId).populate('playersJoined.player hostedBy');
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        // Check if user is the host
        if (match.hostedBy._id.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: 'Only match host can complete the match' });
        }

        // Update match status
        match.status = 'completed';
        match.isCompleted = true;
        match.completedAt = new Date();
        match.result = {
            winner: result || 'Draw',
            description: description || '',
            finishedAt: new Date(),
        };

        await match.save();

        // Update all players' match history
        const allPlayers = match.playersJoined.map(p => p.player._id);
        allPlayers.push(match.hostedBy._id);

        for (const playerId of allPlayers) {
            await User.findByIdAndUpdate(
                playerId,
                {
                    $push: {
                        matchHistory: {
                            match: matchId,
                            joinedAt: new Date(),
                            status: 'completed',
                            completedAt: new Date(),
                            role: playerId.toString() === match.hostedBy._id.toString() ? 'host' : 'player',
                        },
                    },
                    $inc: { matchesCompleted: 1 },
                },
                { new: true }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Match completed successfully',
            match,
            playersToReview: allPlayers.filter(id => id.toString() !== req.user.userId),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error completing match', error: error.message });
    }
};

// Submit a review for a player
export const submitReview = async (req, res) => {
    try {
        const { matchId, reviewedPlayerId } = req.params;
        const { rating, categories, comment, performance, wouldPlayAgain } = req.body;

        // Validate input
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if match exists
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        // Check if match is completed - IMPORTANT: Only allow reviews on completed matches
        if (match.status !== 'completed') {
            return res.status(400).json({
                message: 'Match must be completed before rating players',
                currentStatus: match.status
            });
        }

        // Check if reviewed player was in the match (they must have participated)
        const playerInMatch = match.playersJoined.some(
            p => p.player.toString() === reviewedPlayerId
        ) || match.hostedBy.toString() === reviewedPlayerId;

        if (!playerInMatch) {
            return res.status(400).json({ message: 'Player was not in this match' });
        }

        // Check if reviewer is not the same as reviewed player
        if (req.user.userId.toString() === reviewedPlayerId.toString()) {
            return res.status(400).json({ message: 'Cannot review yourself' });
        }

        // Create or update review
        let review = await Review.findOne({
            match: matchId,
            reviewedBy: req.user.userId,
            reviewedPlayer: reviewedPlayerId,
        });

        if (review) {
            // Rating already exists - cannot re-rate
            return res.status(400).json({ message: 'You have already rated this player in this match' });
        }

        // Create new review
        review = new Review({
            match: matchId,
            reviewedBy: req.user.userId,
            reviewedPlayer: reviewedPlayerId,
            rating,
            categories,
            comment,
            performance,
            wouldPlayAgain,
        });

        await review.save();

        // Add review to match's reviews array
        if (!match.reviews.includes(review._id)) {
            match.reviews.push(review._id);
            if (!match.playersWithReviews.includes(req.user.userId)) {
                match.playersWithReviews.push(req.user.userId);
            }
        }

        // Add review to player's reviewsReceived
        const reviewedUser = await User.findById(reviewedPlayerId);
        if (!reviewedUser.reviewsReceived.includes(review._id)) {
            reviewedUser.reviewsReceived.push(review._id);
        }

        // Update user's average rating
        const allReviews = await Review.find({ reviewedPlayer: reviewedPlayerId });
        const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        reviewedUser.rating = Math.round(averageRating * 10) / 10;
        reviewedUser.totalReviews = allReviews.length;

        await match.save();
        await reviewedUser.save();

        // Check if all players have reviewed each other
        const allPlayersInMatch = match.playersJoined.map(p => p.player.toString());
        allPlayersInMatch.push(match.hostedBy.toString());
        const allReviewsComplete = allPlayersInMatch.every(playerId =>
            match.playersWithReviews.includes(playerId) || playerId === match.hostedBy.toString()
        );

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            review,
            allReviewsComplete,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting review', error: error.message });
    }
};

// Get player profile with match history and reviews
export const getPlayerProfile = async (req, res) => {
    try {
        const { playerId } = req.params;

        const user = await User.findById(playerId)
            .populate('matchHistory.match')
            .populate('reviewsReceived');

        if (!user) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Get detailed review data
        const reviews = await Review.find({ reviewedPlayer: playerId })
            .populate('reviewedBy', 'firstName lastName profilePicture')
            .populate('match', 'title sport matchDate');

        // Calculate stats
        const stats = {
            totalMatches: user.matchesCompleted,
            averageRating: user.rating,
            totalReviews: user.totalReviews,
            positiveReviews: reviews.filter(r => r.rating >= 4).length,
            wouldPlayAgainCount: reviews.filter(r => r.wouldPlayAgain).length,
        };

        // Get match history with details
        const matchHistory = user.matchHistory
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
            .map(m => ({
                ...m.toObject(),
                matchDetails: m.match,
            }));

        res.status(200).json({
            success: true,
            profile: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
                bio: user.bio,
                skillLevel: user.skillLevel,
                sportPreferences: user.sportPreferences,
                location: user.location,
                stats,
                reviews: reviews.map(r => ({
                    _id: r._id,
                    rating: r.rating,
                    categories: r.categories,
                    comment: r.comment,
                    performance: r.performance,
                    wouldPlayAgain: r.wouldPlayAgain,
                    reviewedBy: r.reviewedBy,
                    match: r.match,
                    createdAt: r.createdAt,
                })),
                matchHistory,
                achievements: user.achievements,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching player profile', error: error.message });
    }
};

// Get all reviews for a match
export const getMatchReviews = async (req, res) => {
    try {
        const { matchId } = req.params;

        const reviews = await Review.find({ match: matchId })
            .populate('reviewedBy', 'firstName lastName profilePicture')
            .populate('reviewedPlayer', 'firstName lastName profilePicture')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            reviews,
            totalReviews: reviews.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};
