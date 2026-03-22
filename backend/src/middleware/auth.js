import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

/**
 * Middleware to verify JWT token and authenticate user
 */
export const authenticateToken = (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token provided',
            });
        }

        // Verify token
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: error.message,
        });
    }
};

/**
 * Middleware to handle errors
 */
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { error: err }),
    });
};

/**
 * Middleware to handle 404
 */
export const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
};
