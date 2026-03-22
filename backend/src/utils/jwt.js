import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
    return jwt.sign({ userId }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRE,
    });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
        return null;
    }
};
