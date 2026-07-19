import { Career } from "./career.model";

const seedData = [
  { title: "Senior Frontend Engineer", skills: ["React", "TypeScript", "Next.js", "HTML", "CSS", "Tailwind", "JavaScript"], salary: "$120K - $180K", growth: "+22%", level: "Senior", industry: "Tech", remote: true, company: "TechCorp", location: "San Francisco, CA", description: "Build and maintain high-performance frontend applications using modern frameworks." },
  { title: "Full Stack Developer", skills: ["Node.js", "React", "TypeScript", "PostgreSQL", "MongoDB", "AWS", "Express", "JavaScript"], salary: "$100K - $160K", growth: "+18%", level: "Mid-Senior", industry: "Tech", remote: true, company: "StartupXYZ", location: "Remote", description: "Develop end-to-end features across the entire stack." },
  { title: "DevOps Engineer", skills: ["Docker", "Kubernetes", "Terraform", "CI/CD", "AWS", "Azure", "GCP", "Linux"], salary: "$110K - $170K", growth: "+25%", level: "Senior", industry: "Tech", remote: true, company: "CloudInc", location: "Seattle, WA", description: "Design and maintain CI/CD pipelines and cloud infrastructure." },
  { title: "Backend Developer", skills: ["Node.js", "Python", "Express", "PostgreSQL", "MongoDB", "REST API", "GraphQL", "Redis"], salary: "$100K - $155K", growth: "+20%", level: "Mid-Senior", industry: "Tech", remote: true, company: "DataFlow", location: "New York, NY", description: "Build scalable backend services and APIs." },
  { title: "Data Scientist", skills: ["Python", "Machine Learning", "Deep Learning", "NLP", "TensorFlow", "PyTorch", "SQL", "Data Science"], salary: "$120K - $190K", growth: "+28%", level: "Senior", industry: "Data", remote: true, company: "InsightAI", location: "Remote", description: "Develop ML models to solve complex business problems." },
  { title: "AI/ML Engineer", skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Docker", "AWS"], salary: "$130K - $210K", growth: "+30%", level: "Senior", industry: "Tech", remote: true, company: "NeuralWorks", location: "San Francisco, CA", description: "Build and deploy production-grade machine learning systems." },
  { title: "Product Manager", skills: ["Agile", "Scrum", "REST API", "UI/UX", "Figma"], salary: "$100K - $160K", growth: "+15%", level: "Mid-Senior", industry: "Tech", remote: false, company: "ProductLabs", location: "Austin, TX", description: "Define product strategy and roadmap for SaaS products." },
  { title: "Cloud Architect", skills: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Microservices", "Linux"], salary: "$130K - $200K", growth: "+28%", level: "Senior", industry: "Tech", remote: false, company: "CloudInc", location: "Seattle, WA", description: "Design multi-cloud architectures for enterprise clients." },
  { title: "UX Designer", skills: ["Figma", "UI/UX", "HTML", "CSS", "JavaScript", "Photoshop"], salary: "$90K - $140K", growth: "+12%", level: "Mid", industry: "Design", remote: true, company: "DesignStudio", location: "Remote", description: "Create intuitive and beautiful user experiences." },
  { title: "Mobile Developer", skills: ["React", "TypeScript", "JavaScript", "REST API", "GraphQL", "Node.js"], salary: "$100K - $160K", growth: "+18%", level: "Mid-Senior", industry: "Tech", remote: true, company: "AppCraft", location: "Chicago, IL", description: "Build cross-platform mobile applications." },
  { title: "Cybersecurity Engineer", skills: ["Linux", "Python", "AWS", "Azure", "Docker", "Kubernetes"], salary: "$120K - $185K", growth: "+32%", level: "Senior", industry: "Tech", remote: false, company: "SecureNet", location: "Washington, DC", description: "Protect systems and networks from security threats." },
  { title: "Solutions Architect", skills: ["AWS", "Azure", "GCP", "Microservices", "Docker", "Kubernetes", "REST API", "Node.js"], salary: "$140K - $220K", growth: "+24%", level: "Senior", industry: "Tech", remote: false, company: "EnterpriseCloud", location: "New York, NY", description: "Design technical solutions for enterprise clients." },
  { title: "Machine Learning Engineer", skills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Docker", "AWS", "SQL"], salary: "$130K - $200K", growth: "+30%", level: "Senior", industry: "Data", remote: true, company: "SmartData", location: "Remote", description: "Build and optimize ML pipelines for production." },
  { title: "Data Engineer", skills: ["Python", "SQL", "AWS", "Docker", "MongoDB", "PostgreSQL", "Linux"], salary: "$110K - $170K", growth: "+20%", level: "Mid-Senior", industry: "Data", remote: true, company: "DataFlow", location: "Remote", description: "Design and maintain data pipelines and warehouses." },
  { title: "Technical Writer", skills: ["HTML", "CSS", "JavaScript", "Git", "Linux"], salary: "$70K - $120K", growth: "+10%", level: "Mid", industry: "Tech", remote: true, company: "DocuTech", location: "Remote", description: "Create clear documentation for technical products." },
];

export const seedCareers = async (): Promise<void> => {
  try {
    const count = await Career.countDocuments();
    if (count > 0) {
      return;
    }

    await Career.insertMany(seedData);
  } catch (error) {
    console.error("Seed careers error:", error);
  }
};
