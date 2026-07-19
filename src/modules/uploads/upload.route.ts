import { Router } from "express";
import { upload } from "../../utils/multer";
import { uploadResume, getUserResumes } from "./upload.controller";
import { analyzeResumeHandler } from "./analysis.controller";

const router = Router();

router.post("/", upload.single("resume"), uploadResume);
router.get("/:userId", getUserResumes);
router.post("/:id/analyze", analyzeResumeHandler);

export default router;
