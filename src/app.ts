import express from "express";
import cors from "cors";
import path from "path";
import uploadRoutes from "./modules/uploads/upload.route";
import recommendationRoutes from "./modules/recommendations/recommendation.route";
import chatRoutes from "./modules/chat/chat.route";
import workflowRoutes from "./modules/workflow/workflow.route";
import profileRoutes from "./modules/profile/profile.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/resumes", uploadRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/workflow", workflowRoutes);
app.use("/api/profile", profileRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
