import mongoose from "mongoose";

let connected = false;

const connectDB = async (): Promise<void> => {
  if (connected && mongoose.connection.readyState === 1) return;
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;

    if (!uri || !dbName) {
      console.error("Missing MONGODB_URI or DB_NAME in environment variables");
      return;
    }

    await mongoose.connect(uri, { dbName });
    connected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
