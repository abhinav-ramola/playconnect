import Match from '../models/Match.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { validateCreateMatch } from '../validators/inputValidator.js';
import { updateMatchStatus as updateMatchStatusService, updateMatchStatusManually } from '../services/matchStatusService.js';

/**
 * Create a new match
 */
export const createMatch = async (req, res) => {
    try {
        const { title, description, sport, playersNeeded, matchDate, location, matchType, skillLevel, entryFee, duration, ground, equipment, notes } = req.body;

        // Validate input
        const validation = validateCreateMatch({
            title,
            sport,
            location,
            matchDate,
            playersNeeded,
        });

        if (!validation.isValid) {
            return sendError(res, 'Validation failed', 400, validation.errors);
        }

        // Create new match
        const newMatch = new Match({
            title,
            description,
            sport,
            playersNeeded,
            matchDate: new Date(matchDate),
            hostedBy: req.user.userId,
            location: {
                ...location,
                coordinates: {
                    type: 'Point',
                    coordinates: [location.longitude || 0, location.latitude || 0],
                },
            },
            matchType,
            skillLevel,
            entryFee: entryFee || 0,
            duration: duration || 120,
            ground,
            equipment,
            notes,
            playersJoined: [
                {
                    player: req.user.userId,
                    joinedAt: new Date(),
                },
            ],
        });

        await newMatch.save();
        await newMatch.populate('hostedBy', 'firstName lastName profilePicture');
        await newMatch.populate('playersJoined.player', 'firstName lastName profilePicture');

        // Update user stats
        await User.findByIdAndUpdate(req.user.userId, { $inc: { matchesHosted: 1 } });

        return sendSuccess(res, newMatch, 'Match created successfully', 201);
    } catch (error) {
        console.error('Create match error:', error);
        return sendError(res, 'Error creating match', 500, error.message);
    }
};

/**
 * Get all matches with filters
 * Returns matches grouped by status (upcoming, completed, cancelled, ongoing)
 */
export const getAllMatches = async (req, res) => {
    try {
        const { sport, city, status, page = 1, limit = 10 } = req.query;

        // Build filter object - allow fetching any status or all if not specified
        const filter = {};

        // Apply status filter if provided
        if (status) {
            filter.status = status;
        }

        if (sport) {
            filter.sport = sport;
        }

        if (city) {
            filter['location.city'] = city;
        }

        // Get all unfinished matches to update their status
        const upcomingMatches = await Match.find({ status: { $in: ['upcoming', 'ongoing'] } });
        for (const match of upcomingMatches) {
            await updateMatchStatusService(match._id);
        }

        // Get total count before pagination
        const total = await Match.countDocuments(filter);
        const skip = (page - 1) * limit;

        // Fetch matches sorted by status priority then date
        let matches = await Match.find(filter)
            .populate('hostedBy', 'firstName lastName profilePicture rating totalReviews')
            .populate('playersJoined.player', 'firstName lastName profilePicture rating totalReviews')
            .lean();

        // Custom sort: status priority first, then by date
        const statusPriority = { 'upcoming': 0, 'ongoing': 1, 'completed': 2, 'cancelled': 3 };
        matches.sort((a, b) => {
            const statusDiff = (statusPriority[a.status] || 4) - (statusPriority[b.status] || 4);
            if (statusDiff !== 0) return statusDiff;
            // Within same status, sort by date descending
            return new Date(b.matchDate) - new Date(a.matchDate);
        });

        // Apply pagination
        matches = matches.slice(skip, skip + parseInt(limit));

        return sendSuccess(
            res,
            {
                matches,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit),
                },
            },
            'Matches retrieved successfully'
        );
    } catch (error) {
        console.error('Get all matches error:', error);
        return sendError(res, 'Error retrieving matches', 500, error.message);
    }
};

/**
 * Get match by ID
 */
export const getMatchById = async (req, res) => {
    try {
        // Update status first if needed
        await updateMatchStatusService(req.params.matchId);

        const match = await Match.findById(req.params.matchId)
            .populate('hostedBy', 'firstName lastName profilePicture rating totalReviews')
            .populate('playersJoined.player', 'firstName lastName profilePicture rating totalReviews')
            .populate('reviews', 'reviewedBy reviewedPlayer rating comment');

        if (!match) {
            return sendError(res, 'Match not found', 404);
        }

        return sendSuccess(res, match, 'Match retrieved successfully');
    } catch (error) {
        console.error('Get match by ID error:', error);
        return sendError(res, 'Error retrieving match', 500, error.message);
    }
};

/**
 * Join a match
 */
export const joinMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId);

        if (!match) {
            return sendError(res, 'Match not found', 404);
        }

        // Check if match is full
        if (match.isFull()) {
            return sendError(res, 'Match is full', 400);
        }

        // Check if user already joined
        if (match.isUserJoined(req.user.userId)) {
            return sendError(res, 'You already joined this match', 400);
        }

        // Add user to match
        match.playersJoined.push({
            player: req.user.userId,
            joinedAt: new Date(),
        });

        await match.save();
        await match.populate('hostedBy', 'firstName lastName profilePicture');
        await match.populate('playersJoined.player', 'firstName lastName profilePicture');

        // Update user stats
        await User.findByIdAndUpdate(req.user.userId, { $inc: { matchesJoined: 1 } });

        return sendSuccess(res, match, 'Joined match successfully');
    } catch (error) {
        console.error('Join match error:', error);
        return sendError(res, 'Error joining match', 500, error.message);
    }
};

/**
 * Leave a match
 */
export const leaveMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId);

        if (!match) {
            return sendError(res, 'Match not found', 404);
        }

        // Check if user is in the match
        if (!match.isUserJoined(req.user.userId)) {
            return sendError(res, 'You are not in this match', 400);
        }

        // Remove user from match (but not if they are the host)
        if (match.hostedBy.toString() === req.user.userId.toString()) {
            return sendError(res, 'Host cannot leave the match', 400);
        }

        match.playersJoined = match.playersJoined.filter(player => player.player.toString() !== req.user.userId.toString());

        await match.save();
        await match.populate('hostedBy', 'firstName lastName profilePicture');
        await match.populate('playersJoined.player', 'firstName lastName profilePicture');

        // Update user stats
        await User.findByIdAndUpdate(req.user.userId, { $inc: { matchesJoined: -1 } });

        return sendSuccess(res, match, 'Left match successfully');
    } catch (error) {
        console.error('Leave match error:', error);
        return sendError(res, 'Error leaving match', 500, error.message);
    }
};

/**
 * Update match status (PATCH or PUT)
 */
export const updateMatchStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { matchId } = req.params;

        if (!status) {
            return sendError(res, 'Status is required', 400);
        }

        // Use the status service for validation and update
        const result = await updateMatchStatusManually(matchId, status, req.user.userId);

        if (!result.success) {
            return sendError(res, result.message, result.code);
        }

        // Populate the updated match with user details
        const match = await Match.findById(matchId)
            .populate('hostedBy', 'firstName lastName profilePicture rating')
            .populate('playersJoined.player', 'firstName lastName profilePicture rating');

        return sendSuccess(res, match, result.message);
    } catch (error) {
        console.error('Update match status error:', error);
        return sendError(res, 'Error updating match status', 500, error.message);
    }
};

/**
 * Get nearby matches based on coordinates
 */
export const getNearbyMatches = async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance in meters

        if (!longitude || !latitude) {
            return sendError(res, 'Longitude and latitude are required', 400);
        }

        // Update statuses first
        const upcomingMatches = await Match.find({ status: { $in: ['upcoming', 'ongoing'] } });
        for (const match of upcomingMatches) {
            await updateMatchStatusService(match._id);
        }

        const matches = await Match.find({
            'location.coordinates': {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)],
                    },
                    $maxDistance: maxDistance,
                },
            },
            status: 'upcoming',
        })
            .populate('hostedBy', 'firstName lastName profilePicture rating totalReviews')
            .populate('playersJoined.player', 'firstName lastName profilePicture rating totalReviews');

        return sendSuccess(res, matches, 'Nearby matches retrieved successfully');
    } catch (error) {
        console.error('Get nearby matches error:', error);
        return sendError(res, 'Error retrieving nearby matches', 500, error.message);
    }
};

/**
 * Search matches
 */
export const searchMatches = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return sendError(res, 'Search query is required', 400);
        }

        const matches = await Match.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { sport: { $regex: query, $options: 'i' } },
            ],
            status: 'upcoming',
        })
            .populate('hostedBy', 'firstName lastName profilePicture rating totalReviews')
            .populate('playersJoined.player', 'firstName lastName profilePicture rating totalReviews');

        return sendSuccess(res, matches, 'Search results retrieved successfully');
    } catch (error) {
        console.error('Search matches error:', error);
        return sendError(res, 'Error searching matches', 500, error.message);
    }
};

/**
 * Update match details (only host can update)
 */
export const updateMatch = async (req, res) => {
    try {
        const { title, description, sport, playersNeeded, matchDate, location, matchType, skillLevel, entryFee, duration, ground, equipment, notes } = req.body;

        const match = await Match.findById(req.params.matchId);

        if (!match) {
            return sendError(res, 'Match not found', 404);
        }

        // Check if user is the host
        if (match.hostedBy.toString() !== req.user.userId.toString()) {
            return sendError(res, 'Only host can update match', 403);
        }

        // Update allowed fields
        if (title) match.title = title;
        if (description) match.description = description;
        if (sport) match.sport = sport;
        if (playersNeeded) match.playersNeeded = playersNeeded;
        if (matchDate) match.matchDate = new Date(matchDate);
        if (location) {
            match.location = {
                ...location,
                coordinates: {
                    type: 'Point',
                    coordinates: [location.longitude || 0, location.latitude || 0],
                },
            };
        }
        if (matchType) match.matchType = matchType;
        if (skillLevel) match.skillLevel = skillLevel;
        if (entryFee !== undefined) match.entryFee = entryFee;
        if (duration) match.duration = duration;
        if (ground) match.ground = ground;
        if (equipment) match.equipment = equipment;
        if (notes) match.notes = notes;

        await match.save();
        await match.populate('hostedBy', 'firstName lastName profilePicture');
        await match.populate('playersJoined.player', 'firstName lastName profilePicture');

        return sendSuccess(res, match, 'Match updated successfully');
    } catch (error) {
        console.error('Update match error:', error);
        return sendError(res, 'Error updating match', 500, error.message);
    }
};

/**
 * Delete match (only host can delete)
 */
export const deleteMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId);

        if (!match) {
            return sendError(res, 'Match not found', 404);
        }

        // Check if user is the host
        if (match.hostedBy.toString() !== req.user.userId.toString()) {
            return sendError(res, 'Only host can delete match', 403);
        }

        await Match.findByIdAndDelete(req.params.matchId);

        return sendSuccess(res, null, 'Match deleted successfully');
    } catch (error) {
        console.error('Delete match error:', error);
        return sendError(res, 'Error deleting match', 500, error.message);
    }
};

/**
 * Get user's match history
 */
export const getUserMatches = async (req, res) => {
    try {
        const userId = req.user?.userId || req.params.userId;

        if (!userId) {
            return sendError(res, 'User ID is required', 400);
        }

        // Find matches where user is host or player
        const matches = await Match.find({
            $or: [
                { hostedBy: userId },
                { 'playersJoined.player': userId },
            ],
        })
            .populate('hostedBy', 'firstName lastName profilePicture rating')
            .populate('playersJoined.player', 'firstName lastName profilePicture rating')
            .sort({ matchDate: -1 });

        return sendSuccess(res, matches, 'User matches retrieved successfully');
    } catch (error) {
        console.error('Get user matches error:', error);
        return sendError(res, 'Error retrieving user matches', 500, error.message);
    }
};

/**
 * Get user profile with stats
 */
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .populate('reviewsReceived')
            .populate('matchHistory.match');

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        // Get all reviews for this user
        const reviews = await Review.find({ reviewedPlayer: userId })
            .populate('reviewedBy', 'firstName lastName profilePicture')
            .populate('match', 'title sport matchDate')
            .sort({ createdAt: -1 });

        // Get match history
        const matchHistory = await Match.find({
            $or: [
                { hostedBy: userId },
                { 'playersJoined.player': userId },
            ],
        })
            .populate('hostedBy', 'firstName lastName')
            .sort({ matchDate: -1 })
            .limit(10);

        // Calculate statistics
        const stats = {
            totalMatches: user.matchesCompleted || 0,
            totalHosted: user.matchesHosted || 0,
            totalJoined: user.matchesJoined || 0,
            averageRating: user.rating || 0,
            totalReviews: user.totalReviews || 0,
            positiveReviews: reviews.filter(r => r.rating >= 4).length,
            wouldPlayAgainCount: reviews.filter(r => r.wouldPlayAgain).length,
            achievements: user.achievements || [],
        };

        const profileData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
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
        };

        return sendSuccess(res, profileData, 'User profile retrieved successfully');
    } catch (error) {
        console.error('Get user profile error:', error);
        return sendError(res, 'Error retrieving user profile', 500, error.message);
    }
};
