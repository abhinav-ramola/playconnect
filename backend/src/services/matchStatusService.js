import cron from 'node-cron';
import Match from '../models/Match.js';

/**
 * Service to handle automatic and manual match status updates
 */

/**
 * Update match status based on current time and match details
 * Returns true if status was updated
 */
export const updateMatchStatus = async (matchId) => {
    try {
        const match = await Match.findById(matchId);
        if (!match) return false;

        const now = new Date();
        const matchEndTime = new Date(match.matchDate.getTime() + match.duration * 60000);

        // Update status based on conditions
        let statusUpdated = false;

        // If match time has passed and duration expired, mark as completed
        if (match.status === 'upcoming' && now > matchEndTime) {
            match.status = 'completed';
            match.isCompleted = true;
            match.completedAt = now;
            statusUpdated = true;
        }

        // If match time has passed but not yet ended, mark as ongoing
        if (match.status === 'upcoming' && now > match.matchDate && now <= matchEndTime) {
            match.status = 'ongoing';
            statusUpdated = true;
        }

        if (statusUpdated) {
            await match.save();
        }

        return statusUpdated;
    } catch (error) {
        console.error('Error updating match status:', error);
        return false;
    }
};

/**
 * Batch update all match statuses
 */
export const updateAllMatchStatuses = async () => {
    try {
        const matches = await Match.find({ status: { $in: ['upcoming', 'ongoing'] } });

        for (const match of matches) {
            await updateMatchStatus(match._id);
        }

        console.log('Match statuses updated successfully');
    } catch (error) {
        console.error('Error in batch status update:', error);
    }
};

/**
 * Initialize cron job for automatic status updates
 * Runs every minute
 */
export const initializeMatchStatusCron = () => {
    try {
        // Run every minute
        const cronJob = cron.schedule('* * * * *', async () => {
            await updateAllMatchStatuses();
        });

        console.log('Match status cron job initialized - runs every minute');
        return cronJob;
    } catch (error) {
        console.error('Error initializing cron job:', error);
        return null;
    }
};

/**
 * Manual status update endpoint handler
 * Only creator/admin can update status
 */
export const updateMatchStatusManually = async (matchId, newStatus, userId) => {
    try {
        const match = await Match.findById(matchId);

        if (!match) {
            return {
                success: false,
                message: 'Match not found',
                code: 404,
            };
        }

        // Only host or admin can update status
        if (match.hostedBy.toString() !== userId && !isAdmin(userId)) {
            return {
                success: false,
                message: 'Only match creator can update status',
                code: 403,
            };
        }

        // Validate status transition
        const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
        if (!validStatuses.includes(newStatus)) {
            return {
                success: false,
                message: 'Invalid status value',
                code: 400,
            };
        }

        // Cannot cancel a completed match
        if (match.status === 'completed' && newStatus === 'upcoming') {
            return {
                success: false,
                message: 'Cannot revert a completed match',
                code: 400,
            };
        }

        // Only allow cancellation before match starts
        if (newStatus === 'cancelled' && new Date() > match.matchDate) {
            return {
                success: false,
                message: 'Cannot cancel a match that has already started',
                code: 400,
            };
        }

        // Update status
        const oldStatus = match.status;
        match.status = newStatus;

        if (newStatus === 'completed' && !match.completedAt) {
            match.isCompleted = true;
            match.completedAt = new Date();
        }

        if (newStatus === 'cancelled') {
            match.completedAt = new Date();
        }

        await match.save();

        return {
            success: true,
            message: `Match status updated from ${oldStatus} to ${newStatus}`,
            code: 200,
            data: match,
        };
    } catch (error) {
        console.error('Error updating match status:', error);
        return {
            success: false,
            message: 'Error updating match status',
            code: 500,
            error: error.message,
        };
    }
};

/**
 * Helper: Check if user is admin (can be extended)
 */
const isAdmin = (userId) => {
    // TODO: Implement admin check based on user role
    return false;
};
