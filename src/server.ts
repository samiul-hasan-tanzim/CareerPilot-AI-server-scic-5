import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";
import { seedCareers } from "./modules/careers/career.seed";

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await seedCareers();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();
