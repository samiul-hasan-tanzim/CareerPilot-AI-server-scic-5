import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";
import { seedCareers } from "./modules/careers/career.seed";

const PORT = process.env.PORT || 5000;

console.log("ENV CHECK:", {
  MONGODB_URI: process.env.MONGODB_URI ? "present" : "MISSING",
  DB_NAME: process.env.DB_NAME ? process.env.DB_NAME : "MISSING",
  JWT_SECRET: process.env.JWT_SECRET ? "present" : "MISSING",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "present" : "MISSING",
});

const start = async () => {
  await connectDB();
  await seedCareers();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();
