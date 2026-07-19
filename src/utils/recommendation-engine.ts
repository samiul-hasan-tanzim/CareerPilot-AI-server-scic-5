import { careers, type Career } from "../data/careers";

export interface RecommendationInput {
  skills: string[];
  technologies: string[];
}

export interface RecommendationResult {
  title: string;
  match: number;
  salary: string;
  growth: string;
  skills: string[];
  level: string;
  industry: string;
  remote: boolean;
}

export function getRecommendations(input: RecommendationInput): RecommendationResult[] {
  const allSkills = [...input.skills, ...input.technologies].map((s) => s.toLowerCase());

  const scored = careers.map((career) => {
    const required = career.skills.map((s) => s.toLowerCase());
    const matched = required.filter((r) => allSkills.includes(r)).length;
    const match = Math.round((matched / required.length) * 100);
    return { ...career, match: Math.min(100, match) };
  });

  return scored.sort((a, b) => b.match - a.match);
}
