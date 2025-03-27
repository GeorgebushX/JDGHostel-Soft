import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

export default connectToDatabase;
