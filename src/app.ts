import express from "express";
import path from "path";
import connectDB from "./config/db";
import uploadRoutes from "./modules/uploads/upload.route";
import recommendationRoutes from "./modules/recommendations/recommendation.route";
import chatRoutes from "./modules/chat/chat.route";
import workflowRoutes from "./modules/workflow/workflow.route";
import profileRoutes from "./modules/profile/profile.route";
import authRoutes from "./modules/auth/auth.route";
import careerRoutes from "./modules/careers/career.route";
import dashboardRoutes from "./modules/dashboard/dashboard.route";
import contactRoutes from "./modules/contact/contact.route";
import subscribeRoutes from "./modules/contact/subscribe.route";

const app = express();

app.use(async (_req, res, next) => {
  try {
    const cached = (global as Record<string, unknown>).__mongoose as { conn: unknown; promise: Promise<unknown> | null } | undefined;
    await connectDB().catch(() => {
      if (cached) cached.promise = null;
    });
    next();
  } catch {
    next();
  }
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/resumes", uploadRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/workflow", workflowRoutes);
app.use("/api/profile", profileRoutes);

app.get("/api/health", async (_req, res) => {
  try {
    const mongoose = await import("mongoose");
    const mongoState = mongoose.default.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    res.json({
      status: "ok",
      mongodb: states[mongoState] || "unknown",
      node: process.version,
    });
  } catch {
    res.json({ status: "ok", mongodb: "unknown" });
  }
});

export default app;
