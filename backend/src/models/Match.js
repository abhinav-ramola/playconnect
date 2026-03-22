import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
    {
        // Match Basic Info
        title: {
            type: String,
            required: [true, 'Please provide match title'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },

        // Sport Type
        sport: {
            type: String,
            required: [true, 'Please specify the sport'],
            enum: ['cricket', 'football', 'badminton', 'basketball', 'tennis', 'volleyball', 'other'],
        },

        // Host/Creator
        hostedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // Match Details
        matchType: {
            type: String,
            enum: {
                values: ['casual', 'competitive', 'tournament'],
                message: 'Match type must be casual, competitive, or tournament',
            },
            default: 'casual',
        },

        // Players
        playersNeeded: {
            type: Number,
            required: [true, 'Please specify players needed'],
            min: [1, 'At least 1 player is needed'],
            max: [100, 'Maximum 100 players'],
        },
        playersJoined: [
            {
                player: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                joinedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        // Location
        location: {
            address: {
                type: String,
                required: [true, 'Address is required'],
            },
            city: {
                type: String,
                required: [true, 'City is required'],
            },
            coordinates: {
                type: {
                    type: String,
                    enum: ['Point'],
                    default: 'Point',
                },
                coordinates: {
                    type: [Number], // [longitude, latitude]
                    required: true,
                },
            },
        },

        // Date & Time
        matchDate: {
            type: Date,
            required: [true, 'Please provide match date'],
        },
        duration: {
            type: Number, // in minutes
            default: 120,
        },

        // Match Status
        status: {
            type: String,
            enum: {
                values: ['upcoming', 'ongoing', 'completed', 'cancelled'],
                message: 'Status must be upcoming, ongoing, completed, or cancelled',
            },
            default: 'upcoming',
        },

        // Skill Level Required
        skillLevel: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'all'],
            default: 'all',
        },

        // Entry Requirements
        entryFee: {
            type: Number,
            default: 0,
        },

        // Additional Info
        ground: String, // Ground/Venue name
        equipment: String, // What equipment is needed
        notes: String, // Any additional notes

        // Match Result
        result: {
            winner: String,
            description: String,
            finishedAt: Date,
        },

        // Match Completion & Reviews
        isCompleted: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review',
            },
        ],
        playersWithReviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],

        // Ratings & Reviews
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        // Timestamps
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Create geospatial index for location-based queries
matchSchema.index({ 'location.coordinates': '2dsphere' });

// Index for filtering by status and date
matchSchema.index({ status: 1, matchDate: 1 });

// Index for filtering by sport
matchSchema.index({ sport: 1 });

// Method to check if a user is already joined
matchSchema.methods.isUserJoined = function (userId) {
    return this.playersJoined.some(player => player.player.toString() === userId.toString());
};

// Method to get available spots
matchSchema.methods.getAvailableSpots = function () {
    return this.playersNeeded - this.playersJoined.length;
};

// Method to check if match is full
matchSchema.methods.isFull = function () {
    return this.playersJoined.length >= this.playersNeeded;
};

const Match = mongoose.model('Match', matchSchema);

export default Match;
