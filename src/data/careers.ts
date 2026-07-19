export interface Career {
  title: string;
  skills: string[];
  salary: string;
  growth: string;
  level: string;
  industry: string;
  remote: boolean;
}

export const careers: Career[] = [
  { title: "Senior Frontend Engineer", skills: ["React", "TypeScript", "Next.js", "HTML", "CSS", "Tailwind", "JavaScript"], salary: "$120K - $180K", growth: "+22%", level: "Senior", industry: "Tech", remote: true },
  { title: "Full Stack Developer", skills: ["Node.js", "React", "TypeScript", "PostgreSQL", "MongoDB", "AWS", "Express", "JavaScript"], salary: "$100K - $160K", growth: "+18%", level: "Mid-Senior", industry: "Tech", remote: true },
  { title: "DevOps Engineer", skills: ["Docker", "Kubernetes", "Terraform", "CI/CD", "AWS", "Azure", "GCP", "Linux"], salary: "$110K - $170K", growth: "+25%", level: "Senior", industry: "Tech", remote: true },
  { title: "Backend Developer", skills: ["Node.js", "Python", "Express", "PostgreSQL", "MongoDB", "REST API", "GraphQL", "Redis"], salary: "$100K - $155K", growth: "+20%", level: "Mid-Senior", industry: "Tech", remote: true },
  { title: "Data Scientist", skills: ["Python", "Machine Learning", "Deep Learning", "NLP", "TensorFlow", "PyTorch", "SQL", "Data Science"], salary: "$120K - $190K", growth: "+28%", level: "Senior", industry: "Data", remote: true },
  { title: "Data Engineer", skills: ["Python", "SQL", "AWS", "Docker", "MongoDB", "PostgreSQL", "Linux"], salary: "$110K - $170K", growth: "+20%", level: "Mid-Senior", industry: "Data", remote: true },
  { title: "AI/ML Engineer", skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Docker", "AWS"], salary: "$130K - $210K", growth: "+30%", level: "Senior", industry: "Tech", remote: true },
  { title: "Product Manager", skills: ["Agile", "Scrum", "REST API", "UI/UX", "Figma"], salary: "$100K - $160K", growth: "+15%", level: "Mid-Senior", industry: "Tech", remote: false },
  { title: "Cloud Architect", skills: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Microservices", "Linux"], salary: "$130K - $200K", growth: "+28%", level: "Senior", industry: "Tech", remote: false },
  { title: "UX Designer", skills: ["Figma", "UI/UX", "HTML", "CSS", "JavaScript", "Photoshop"], salary: "$90K - $140K", growth: "+12%", level: "Mid", industry: "Design", remote: true },
  { title: "Mobile Developer", skills: ["React", "TypeScript", "JavaScript", "REST API", "GraphQL", "Node.js"], salary: "$100K - $160K", growth: "+18%", level: "Mid-Senior", industry: "Tech", remote: true },
  { title: "Cybersecurity Engineer", skills: ["Linux", "Python", "AWS", "Azure", "Docker", "Kubernetes"], salary: "$120K - $185K", growth: "+32%", level: "Senior", industry: "Tech", remote: false },
  { title: "Solutions Architect", skills: ["AWS", "Azure", "GCP", "Microservices", "Docker", "Kubernetes", "REST API", "Node.js"], salary: "$140K - $220K", growth: "+24%", level: "Senior", industry: "Tech", remote: false },
  { title: "Machine Learning Engineer", skills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Docker", "AWS", "SQL"], salary: "$130K - $200K", growth: "+30%", level: "Senior", industry: "Data", remote: true },
  { title: "Technical Writer", skills: ["HTML", "CSS", "JavaScript", "Git", "Linux"], salary: "$70K - $120K", growth: "+10%", level: "Mid", industry: "Tech", remote: true },
];
