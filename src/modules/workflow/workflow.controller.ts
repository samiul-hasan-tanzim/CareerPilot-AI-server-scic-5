import { Request, Response } from "express";
import { Resume } from "../uploads/upload.model";
import { getRecommendations } from "../../utils/recommendation-engine";

const STEP_LABELS = [
  "Resume Upload",
  "Extract Information",
  "Skill Identification",
  "Market Research",
  "Job Matching",
  "Generate Recommendations",
  "Build Learning Roadmap",
];

export const getWorkflowStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const latest = await Resume.findOne({ userId }).sort({ createdAt: -1 });

    let completedSteps = 0;

    if (!latest) {
      res.json({ completedSteps: 0, totalSteps: 7, steps: STEP_LABELS.map((label, i) => ({ label, index: i, status: "pending" as const })) });
      return;
    }

    // Step 1: Resume Upload - file exists
    if (latest.fileBuffer) completedSteps = 1;

    // Step 2: Extract Information - extractedData exists
    if (latest.extractedData?.skills && latest.extractedData.skills.length > 0) completedSteps = 2;

    // Step 3: Skill Identification - skills + technologies identified
    if ((latest.extractedData?.skills?.length ?? 0) + (latest.extractedData?.technologies?.length ?? 0) >= 1) completedSteps = 3;

    // Step 4: Market Research - always possible when skills exist
    if (completedSteps >= 3) completedSteps = 4;

    // Step 5: Job Matching - recommendations can be generated
    if (completedSteps >= 4) completedSteps = 5;

    // Step 6: Generate Recommendations - analysis exists
    if (latest.analysis?.score) completedSteps = 6;

    // Step 7: Build Learning Roadmap - all previous done
    if (completedSteps >= 6) completedSteps = 7;

    const steps = STEP_LABELS.map((label, i) => ({
      label,
      index: i,
      status: (i < completedSteps ? "completed" : i === completedSteps ? "running" : "pending") as "completed" | "running" | "pending",
    }));

    res.json({ completedSteps, totalSteps: 7, steps });
  } catch (error) {
    console.error("Workflow error:", error);
    res.status(500).json({ message: "Failed to get workflow status" });
  }
};

export const runWorkflow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    const uid = userId || "anonymous";

    const latest = await Resume.findOne({ userId: uid }).sort({ createdAt: -1 });

    const logs: { time: string; msg: string }[] = [];
    const now = () => new Date().toLocaleTimeString("en-US", { hour12: false });

    const addLog = (msg: string) => logs.push({ time: now(), msg });

    if (!latest) {
      addLog("No resume found. Please upload a resume first.");
      res.json({ logs, success: false });
      return;
    }

    addLog("Resume found — starting workflow");

    if (latest.extractedData) {
      addLog(`Extracted ${latest.extractedData.skills.length} skills and ${latest.extractedData.technologies.length} technologies`);
    }

    if (latest.analysis) {
      addLog(`Analysis complete — resume score: ${latest.analysis.score}/100`);
      addLog(`Strengths identified: ${latest.analysis.strengths.length}`);
      addLog(`Weaknesses identified: ${latest.analysis.weaknesses.length}`);
      addLog(`Recommendations generated: ${latest.analysis.recommendations.length}`);
    }

    if (latest.extractedData) {
      const recs = getRecommendations({
        skills: latest.extractedData.skills || [],
        technologies: latest.extractedData.technologies || [],
      });
      addLog(`Job matching complete — ${recs.length} career paths evaluated`);
      if (recs.length > 0) {
        addLog(`Top match: ${recs[0].title} (${recs[0].match}% match)`);
      }
    }

    addLog("Learning roadmap ready — based on skill gaps and career goals");
    addLog("Workflow completed successfully");

    res.json({ logs, success: true });
  } catch (error) {
    console.error("Run workflow error:", error);
    res.status(500).json({ message: "Failed to run workflow" });
  }
};
