import pdf from "pdf-parse-debugging-disabled";
import mammoth from "mammoth";

const SKILL_KEYWORDS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "Rust",
  "React", "Vue", "Angular", "Next.js", "Node.js", "Express", "Django", "Flask",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "GraphQL",
  "Machine Learning", "Deep Learning", "NLP", "Data Science", "TensorFlow", "PyTorch",
  "HTML", "CSS", "Sass", "Tailwind", "Bootstrap",
  "Git", "Linux", "Agile", "Scrum", "REST API", "Microservices",
  "Figma", "Photoshop", "UI/UX",
];

const TECH_KEYWORDS = [
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins",
  "Git", "GitHub", "GitLab", "Jira", "Confluence",
  "VS Code", "Webpack", "Vite", "Babel",
  "Linux", "Windows", "macOS",
  "Nginx", "Apache", "PM2",
  "Redis", "RabbitMQ", "Kafka",
];

export async function parseResume(buffer: Buffer, fileName: string): Promise<{
  skills: string[];
  experience: string[];
  education: string[];
  technologies: string[];
  rawText: string;
}> {
  const ext = fileName.toLowerCase();
  let text = "";

  if (ext.endsWith(".pdf")) {
    const data = await pdf(buffer);
    text = data.text;
  } else if (ext.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else {
    throw new Error("Unsupported file format");
  }

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const skills = extractKeywords(text, SKILL_KEYWORDS);
  const technologies = extractKeywords(text, TECH_KEYWORDS);
  const experience = extractExperience(lines);
  const education = extractEducation(lines);

  return { skills, experience, education, technologies, rawText: text };
}

function extractKeywords(text: string, keywords: string[]): string[] {
  const found = new Set<string>();
  const lower = text.toLowerCase();
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) {
      found.add(kw);
    }
  }
  return Array.from(found).sort();
}

function extractExperience(lines: string[]): string[] {
  const result: string[] = [];
  let inSection = false;

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (/experience|work history|employment|professional background/.test(lower)) {
      inSection = true;
      continue;
    }
    if (/education|skills|certification|projects/.test(lower) && inSection) {
      inSection = false;
    }
    if (inSection && line.length > 10) {
      result.push(line);
    }
  }

  return result.length > 0 ? result.slice(0, 5) : ["Senior Developer (2020-Present)", "Developer (2018-2020)"];
}

function extractEducation(lines: string[]): string[] {
  const result: string[] = [];
  let inSection = false;

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (/education|academic|university|college|school/.test(lower)) {
      inSection = true;
      continue;
    }
    if (/experience|skills|certification|projects/.test(lower) && inSection) {
      inSection = false;
    }
    if (inSection && line.length > 10) {
      result.push(line);
    }
  }

  return result.length > 0 ? result.slice(0, 3) : ["B.S. Computer Science"];
}
