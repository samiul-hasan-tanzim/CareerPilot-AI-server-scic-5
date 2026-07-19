import { Request, Response } from "express";
import { Resume } from "../uploads/upload.model";
import { Conversation } from "../chat/chat.model";
import { UserProfile } from "../profile/profile.model";
import { Career } from "../careers/career.model";
import { getRecommendations } from "../../utils/recommendation-engine";

export const getOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const latestResume = await Resume.findOne({ userId }).sort({ createdAt: -1 }).lean();

    const resumeCount = await Resume.countDocuments({ userId });
    const chatCount = await Conversation.countDocuments({ userId });
    const profile = await UserProfile.findOne({ userId }).lean();

    const allResumes = await Resume.find({ userId }).sort({ createdAt: -1 }).lean();

    const allSkills: string[] = [];
    const skillCategoryMap: Record<string, number> = {};

    const technologyCategories: Record<string, string[]> = {
      Frontend: ["react", "angular", "vue", "next.js", "html", "css", "tailwind", "javascript", "typescript", "figma", "ui/ux"],
      Backend: ["node.js", "express", "python", "java", "c#", "go", "rust", "graphql", "rest api", "postgresql", "mongodb", "redis"],
      DevOps: ["docker", "kubernetes", "terraform", "ci/cd", "aws", "azure", "gcp", "linux"],
      Data: ["machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "data science", "sql", "python"],
    };

    for (const resume of allResumes) {
      if (resume.extractedData) {
        allSkills.push(...(resume.extractedData.skills || []));
        const techs = resume.extractedData.technologies || [];
        for (const tech of techs) {
          const lower = tech.toLowerCase();
          for (const [category, keywords] of Object.entries(technologyCategories)) {
            if (keywords.some((k) => lower.includes(k))) {
              skillCategoryMap[category] = (skillCategoryMap[category] || 0) + 1;
              break;
            }
          }
        }
      }
    }

    const uniqueSkills = [...new Set(allSkills.map((s) => s.toLowerCase()))];
    const totalSkillCount = Object.values(skillCategoryMap).reduce((a, b) => a + b, 0) || 1;
    const skillDistribution = Object.entries(skillCategoryMap).map(([name, value]) => ({
      name,
      value: Math.round((value / totalSkillCount) * 100),
    }));

    if (skillDistribution.length === 0) {
      skillDistribution.push({ name: "Frontend", value: 35 }, { name: "Backend", value: 25 }, { name: "DevOps", value: 15 }, { name: "Data", value: 15 }, { name: "Design", value: 10 });
    }

    const careerCount = await Career.countDocuments({});

    const jobsByIndustry = await Career.aggregate([
      { $group: { _id: "$industry", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const demandTrend = [
      { month: "Jan", frontend: 80, backend: 65, devops: 45 },
      { month: "Feb", frontend: 82, backend: 68, devops: 48 },
      { month: "Mar", frontend: 85, backend: 72, devops: 52 },
      { month: "Apr", frontend: 83, backend: 75, devops: 55 },
      { month: "May", frontend: 88, backend: 78, devops: 60 },
      { month: "Jun", frontend: 92, backend: 82, devops: 65 },
    ];

    const activities: Array<{ icon: string; text: string; time: string }> = [];

    if (latestResume) {
      const timeAgo = getTimeAgo(new Date(latestResume.createdAt));
      activities.push({ icon: "Upload", text: "Resume uploaded successfully", time: timeAgo });
      activities.push({ icon: "Brain", text: "AI analysis completed", time: timeAgo });
    }

    if (chatCount > 0) {
      const latestChat = await Conversation.findOne({ userId }).sort({ updatedAt: -1 }).lean();
      if (latestChat) {
        activities.push({ icon: "MessageSquareText", text: "AI Chat session saved", time: getTimeAgo(new Date(latestChat.updatedAt)) });
      }
    }

    if (profile) {
      activities.push({ icon: "Target", text: "Career preferences updated", time: getTimeAgo(new Date(profile.updatedAt)) });
    }

    let topRecommendations: Array<{ title: string; match: number; company: string }> = [];

    if (latestResume?.extractedData) {
      const recs = getRecommendations({
        skills: latestResume.extractedData.skills || [],
        technologies: latestResume.extractedData.technologies || [],
      });
      topRecommendations = recs.slice(0, 3).map((r) => ({
        title: r.title,
        match: r.match,
        company: r.industry === "Data" ? "DataFlow" : r.industry === "Design" ? "DesignStudio" : r.remote ? "Remote.io" : "TechCorp",
      }));
    }

    res.json({
      stats: {
        resumeScore: latestResume?.analysis?.score || 0,
        skillsIdentified: uniqueSkills.length,
        recommendedJobs: careerCount,
        completedAnalyses: resumeCount,
      },
      skillDistribution,
      demandTrend,
      readinessData: [
        { month: "Jan", score: 55 },
        { month: "Feb", score: 62 },
        { month: "Mar", score: 70 },
        { month: "Apr", score: 68 },
        { month: "May", score: 78 },
        { month: "Jun", score: Math.min(100, latestResume?.analysis?.score || 85) },
      ],
      activities,
      recommendations: topRecommendations,
      jobsByIndustry,
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
