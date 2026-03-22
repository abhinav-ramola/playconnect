import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { validateSignup, validateLogin } from '../validators/inputValidator.js';

/**
 * User Signup Controller
 */
export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, city, state, address, sportPreferences } = req.body;

        // Validate input
        const validation = validateSignup({
            firstName,
            lastName,
            email,
            phone,
            password,
            city,
        });

        if (!validation.isValid) {
            return sendError(res, 'Validation failed', 400, validation.errors);
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return sendError(res, 'Email already registered', 400);
        }

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            phone,
            password,
            location: {
                address: address || '',
                city,
                state: state || '',
                coordinates: {
                    type: 'Point',
                    coordinates: [0, 0], // Will be updated with actual location later
                },
            },
            sportPreferences: sportPreferences || [],
        });

        // Save user to database
        await newUser.save();

        // Generate JWT token
        const token = generateToken(newUser._id);

        // Return response without password
        const userResponse = newUser.toJSON();

        return sendSuccess(
            res,
            {
                user: userResponse,
                token,
            },
            'User signed up successfully',
            201
        );
    } catch (error) {
        console.error('Signup error:', error);
        return sendError(res, 'Error during signup', 500, error.message);
    }
};

/**
 * User Login Controller
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        const validation = validateLogin({ email, password });
        if (!validation.isValid) {
            return sendError(res, 'Validation failed', 400, validation.errors);
        }

        // Find user by email (include password field)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return sendError(res, 'Invalid email or password', 401);
        }

        // Compare passwords
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return sendError(res, 'Invalid email or password', 401);
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Return response without password
        const userResponse = user.toJSON();

        return sendSuccess(
            res,
            {
                user: userResponse,
                token,
            },
            'Login successful'
        );
    } catch (error) {
        console.error('Login error:', error);
        return sendError(res, 'Error during login', 500, error.message);
    }
};

/**
 * Get Current User Profile
 */
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        return sendSuccess(res, user, 'User profile retrieved successfully');
    } catch (error) {
        console.error('Get current user error:', error);
        return sendError(res, 'Error retrieving user', 500, error.message);
    }
};

/**
 * Update User Profile
 */
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, bio, sportPreferences, skillLevel, location } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                phone: phone || undefined,
                bio: bio || undefined,
                sportPreferences: sportPreferences || undefined,
                skillLevel: skillLevel || undefined,
                location: location || undefined,
                updatedAt: new Date(),
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        return sendSuccess(res, user, 'Profile updated successfully');
    } catch (error) {
        console.error('Update profile error:', error);
        return sendError(res, 'Error updating profile', 500, error.message);
    }
};

/**
 * Get User by ID
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        return sendSuccess(res, user, 'User retrieved successfully');
    } catch (error) {
        console.error('Get user by ID error:', error);
        return sendError(res, 'Error retrieving user', 500, error.message);
    }
};

/**
 * Upload Profile Picture
 */
export const uploadProfilePicture = async (req, res) => {
    try {
        const { image } = req.body; // Base64 encoded image

        if (!image) {
            return sendError(res, 'Image is required', 400);
        }

        // Validate image size (max 5MB)
        if (image.length > 5242880) {
            return sendError(res, 'Image size should not exceed 5MB', 400);
        }

        // Validate image format
        if (!image.startsWith('data:image/')) {
            return sendError(res, 'Invalid image format. Please provide a valid image', 400);
        }

        // Update user profile picture
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                profilePicture: image,
                updatedAt: new Date(),
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        return sendSuccess(res, user, 'Profile picture uploaded successfully');
    } catch (error) {
        console.error('Upload profile picture error:', error);
        return sendError(res, 'Error uploading profile picture', 500, error.message);
    }
};
