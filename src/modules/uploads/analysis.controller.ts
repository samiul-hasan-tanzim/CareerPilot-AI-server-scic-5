import { Request, Response } from "express";
import { Resume } from "./upload.model";
import { analyzeResume } from "../../utils/resume-analyzer";

export const analyzeResumeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const resume = await Resume.findById(id);
    if (!resume) {
      res.status(404).json({ message: "Resume not found" });
      return;
    }

    if (!resume.extractedData) {
      res.status(400).json({ message: "Resume has no extracted data to analyze" });
      return;
    }

    const analysis = analyzeResume(resume.extractedData);

    resume.analysis = analysis;
    await resume.save();

    res.json({
      message: "Resume analyzed successfully",
      analysis,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ message: "Failed to analyze resume" });
  }
};
