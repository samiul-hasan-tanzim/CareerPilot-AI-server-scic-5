import { Request, Response } from "express";
import { Resume } from "../uploads/upload.model";
import { getRecommendations } from "../../utils/recommendation-engine";

export const getCareerRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const latest = await Resume.findOne({ userId }).sort({ createdAt: -1 });

    if (!latest || !latest.extractedData) {
      res.json({ recommendations: [] });
      return;
    }

    const recommendations = getRecommendations({
      skills: latest.extractedData.skills || [],
      technologies: latest.extractedData.technologies || [],
    });

    res.json({ recommendations });
  } catch (error) {
    console.error("Recommendations error:", error);
    res.status(500).json({ message: "Failed to get recommendations" });
  }
};
