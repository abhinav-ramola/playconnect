import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // Server
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database
    MONGODB_LOCAL_URI: process.env.MONGODB_LOCAL_URI,
    MONGODB_ATLAS_URI: process.env.MONGODB_ATLAS_URI,

    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

    // Socket.io
    SOCKET_IO_CORS_ORIGIN: process.env.SOCKET_IO_CORS_ORIGIN || 'http://localhost:3000',
};
