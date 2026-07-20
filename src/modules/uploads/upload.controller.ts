import { Request, Response } from "express";
import path from "path";
import type { AuthRequest } from "../../middlewares/verifyToken";
import { Resume } from "./upload.model";
import { parseResume } from "../../utils/resume-parser";
import { analyzeResume } from "../../utils/resume-analyzer";

export const uploadResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const file = req.file;

    const parsed = await parseResume(file.buffer, file.originalname);

    const resume = await Resume.create({
      userId: req.userId || "anonymous",
      fileName: file.originalname,
      fileSize: file.size,
      fileType: path.extname(file.originalname).toLowerCase(),
      fileBuffer: file.buffer,
      extractedData: {
        skills: parsed.skills,
        experience: parsed.experience,
        education: parsed.education,
        technologies: parsed.technologies,
      },
      analysis: analyzeResume(parsed),
    });

    res.status(201).json({
      message: "Resume uploaded and parsed successfully",
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        fileType: resume.fileType,
        extractedData: resume.extractedData,
        analysis: resume.analysis,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Upload error:", msg);
    res.status(500).json({ message: "Failed to upload resume", error: msg });
  }
};

export const getUserResumes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.params.userId;
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
    res.json({ resumes });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Fetch resumes error:", msg);
    res.status(500).json({ message: "Failed to fetch resumes", error: msg });
  }
};

export const deleteResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Resume.findByIdAndDelete(id);
    res.json({ message: "Resume deleted" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Delete resume error:", msg);
    res.status(500).json({ message: "Failed to delete resume", error: msg });
  }
};
