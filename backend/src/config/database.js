import mongoose from 'mongoose';

/**
 * Connect to MongoDB
 * Supports both local MongoDB and MongoDB Atlas
 */
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_LOCAL_URI || process.env.MONGODB_ATLAS_URI;

        if (!mongoURI) {
            throw new Error('No MongoDB URI found in environment variables');
        }

        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
