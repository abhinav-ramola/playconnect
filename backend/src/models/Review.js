import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        // Match Reference
        match: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Match',
            required: true,
        },

        // Reviewer (who is giving the review)
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // Reviewed Player (who is being reviewed)
        reviewedPlayer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // Rating (1-5)
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },

        // Review Categories
        categories: {
            teamwork: {
                type: Number,
                min: 1,
                max: 5,
            },
            communication: {
                type: Number,
                min: 1,
                max: 5,
            },
            sportsmanship: {
                type: Number,
                min: 1,
                max: 5,
            },
            skillLevel: {
                type: Number,
                min: 1,
                max: 5,
            },
        },

        // Review Text
        comment: {
            type: String,
            maxlength: [500, 'Comment cannot exceed 500 characters'],
        },

        // Match Performance
        performance: {
            type: String,
            enum: ['outstanding', 'good', 'average', 'below_average'],
            default: 'average',
        },

        // Recommendations
        wouldPlayAgain: {
            type: Boolean,
            default: true,
        },

        // Timestamp
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure one review per reviewer per player per match
reviewSchema.index({ match: 1, reviewedBy: 1, reviewedPlayer: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
