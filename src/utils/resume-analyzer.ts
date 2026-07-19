interface AnalysisInput {
  skills: string[];
  experience: string[];
  education: string[];
  technologies: string[];
}

interface AnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const CAREER_LEVELS = ["junior", "mid", "senior", "lead", "principal", "director"];
const SOFT_SKILLS = ["communication", "leadership", "teamwork", "problem solving", "critical thinking", "time management"];

export function analyzeResume(data: AnalysisInput): AnalysisResult {
  const allKeywords = [...data.skills, ...data.technologies];
  const allText = [...data.skills, ...data.experience, ...data.education, ...data.technologies].join(" ").toLowerCase();

  let score = 50;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (data.skills.length >= 5) {
    score += 15;
    strengths.push("Strong technical skill set with multiple areas of expertise");
  } else if (data.skills.length >= 3) {
    score += 8;
  }

  if (data.experience.length >= 2) {
    score += 10;
    strengths.push("Solid work experience history");
  } else if (data.experience.length === 1) {
    score += 5;
  }

  if (data.education.length >= 1) {
    score += 5;
    strengths.push("Formal education background");
  }

  if (data.technologies.length >= 3) {
    score += 10;
    strengths.push("Proficiency with modern tools and technologies");
  }

  const hasSoftSkills = SOFT_SKILLS.some((s) => allText.includes(s));
  if (hasSoftSkills) {
    score += 5;
    strengths.push("Demonstrates soft skills valued by employers");
  } else {
    weaknesses.push("Soft skills not explicitly mentioned");
    recommendations.push("Consider highlighting soft skills like leadership, communication, and teamwork");
  }

  const hasMetrics = /\d+%|\d+ years|\$\d+/.test(allText);
  if (hasMetrics) {
    score += 5;
    strengths.push("Uses quantifiable achievements");
  } else {
    recommendations.push("Add measurable achievements (e.g., 'increased efficiency by 20%')");
  }

  const hasCareerLevel = CAREER_LEVELS.some((l) => allText.includes(l));
  if (!hasCareerLevel) {
    recommendations.push("Mention your career level (e.g., Senior, Lead) to help recruiters filter correctly");
  }

  if (data.skills.length < 3) {
    weaknesses.push("Limited skill variety — consider expanding your skill set");
    recommendations.push("List more technical skills relevant to your target role");
  }

  if (data.experience.length === 0) {
    weaknesses.push("No work experience listed");
    recommendations.push("Include relevant work experience or internship details");
  }

  score = Math.min(100, Math.max(0, score));

  let summary: string;
  if (score >= 80) {
    summary = "Strong resume with a well-rounded skill set and solid experience. Minor improvements can make it outstanding.";
  } else if (score >= 60) {
    summary = "Good foundation with room for improvement. Focus on adding more measurable achievements and expanding skills.";
  } else {
    summary = "Needs significant improvements. Consider adding more technical skills, experience details, and quantifiable results.";
  }

  return { score, summary, strengths, weaknesses, recommendations };
}
