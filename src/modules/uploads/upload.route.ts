import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { upload } from "../../utils/multer";
import { uploadResume, getUserResumes, deleteResume } from "./upload.controller";
import { analyzeResumeHandler } from "./analysis.controller";

const router = Router();

router.post("/", upload.single("resume"), verifyToken, uploadResume);
router.get("/:userId", verifyToken, getUserResumes);
router.post("/:id/analyze", verifyToken, analyzeResumeHandler);
router.delete("/:id", verifyToken, deleteResume);

export default router;
