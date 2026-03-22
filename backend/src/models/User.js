import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        // Basic Information
        firstName: {
            type: String,
            required: [true, 'Please provide your first name'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Please provide your last name'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
        },
        phone: {
            type: String,
            required: [true, 'Please provide your phone number'],
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
        },

        // Authentication
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password in queries by default
        },

        // Profile Information
        profilePicture: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
        },

        // Location
        location: {
            address: String,
            city: {
                type: String,
                required: [true, 'City is required'],
            },
            state: String,
            zipCode: String,
            coordinates: {
                type: {
                    type: String,
                    enum: ['Point'],
                    default: 'Point',
                },
                coordinates: {
                    type: [Number], // [longitude, latitude]
                    default: [0, 0],
                },
            },
        },

        // Sports Preferences
        sportPreferences: {
            type: [String], // ['cricket', 'football', 'badminton', etc.]
            default: [],
        },

        // Skills/Experience
        skillLevel: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'professional'],
            default: 'beginner',
        },

        // Stats
        matchesHosted: {
            type: Number,
            default: 0,
        },
        matchesJoined: {
            type: Number,
            default: 0,
        },
        matchesCompleted: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },

        // Match History
        matchHistory: [
            {
                match: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Match',
                },
                joinedAt: Date,
                role: {
                    type: String,
                    enum: ['host', 'player'],
                    default: 'player',
                },
                status: {
                    type: String,
                    enum: ['pending', 'completed', 'cancelled'],
                    default: 'pending',
                },
                completedAt: Date,
            },
        ],

        // Reviews Received
        reviewsReceived: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review',
            },
        ],

        // Badge/Achievement System
        achievements: [
            {
                badge: String,
                earnedAt: Date,
                description: String,
            },
        ],

        // Account Status
        isActive: {
            type: Boolean,
            default: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },

        // Social
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],

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
        // Automatically update updatedAt
        timestamps: true,
    }
);

// Create geospatial index for location-based queries
userSchema.index({ 'location.coordinates': '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
};

// Method to get full name
userSchema.methods.getFullName = function () {
    return `${this.firstName} ${this.lastName}`;
};

// Remove sensitive data before returning user
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
