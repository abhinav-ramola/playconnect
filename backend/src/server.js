import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║     🎯 PlayConnect Backend Server      ║
║          Server Running on PORT ${PORT}      ║
╚═══════════════════════════════════════╝
  `);
});

export default app;
