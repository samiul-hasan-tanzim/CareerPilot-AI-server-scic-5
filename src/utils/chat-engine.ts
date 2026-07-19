import { Resume } from "../modules/uploads/upload.model";
import { generateWithGemini } from "./gemini";

interface ChatContext {
  skills: string[];
  technologies: string[];
  experience: string[];
  education: string[];
  score?: number;
}

const topicPatterns: { pattern: RegExp; response: (ctx: ChatContext) => string }[] = [
  {
    pattern: /improve.*(resume|cv)/i,
    response: (ctx) => {
      const lines = [
        "Here are actionable tips to improve your resume:\n",
        "1. **Quantify achievements** — Use numbers, percentages, and timeframes (e.g., \"Increased efficiency by 30%\")\n",
        "2. **Tailor for ATS** — Use standard section headings (Experience, Education, Skills) and include keywords from job descriptions\n",
        "3. **Highlight impact** — Instead of listing duties, show how you made a difference\n",
        "4. **Keep it concise** — 1 page for <10 years experience, 2 pages max for senior roles\n",
        "5. **Remove outdated skills** — Focus on technologies relevant to your target role\n",
      ];
      if (ctx.skills.length > 0) {
        lines.push(`\nYour current strengths include **${ctx.skills.slice(0, 3).join(", ")}** — lead with these.`);
      }
      if (ctx.score !== undefined && ctx.score < 70) {
        lines.push(`\nYour resume score is **${ctx.score}/100**. The suggestions above can boost it significantly.`);
      }
      return lines.join("\n");
    },
  },
  {
    pattern: /which skills should i learn/i,
    response: (ctx) => {
      const has = [...ctx.skills, ...ctx.technologies].map((s) => s.toLowerCase());
      const suggestions: string[] = [];
      if (!has.some((s) => ["aws", "azure", "gcp"].includes(s))) suggestions.push("☁️ **Cloud Platforms** (AWS, Azure, or GCP) — most in-demand skill");
      if (!has.some((s) => ["docker", "kubernetes"].includes(s))) suggestions.push("🐳 **Docker & Kubernetes** — essential for modern deployments");
      if (!has.some((s) => ["machine learning", "deep learning", "ai"].includes(s))) suggestions.push("🤖 **Machine Learning / AI** — rapidly growing field");
      if (!has.some((s) => ["graphql"].includes(s))) suggestions.push("⚡ **GraphQL** — modern API alternative to REST");
      if (!has.some((s) => ["system design", "architecture"].includes(s))) suggestions.push("📐 **System Design** — critical for senior roles");

      if (suggestions.length === 0) {
        return "You already have a strong skill set covering the most in-demand areas! Consider deepening expertise in your current stack or exploring adjacent technologies.";
      }
      return "Based on market trends, here are skills to learn next:\n\n" + suggestions.join("\n");
    },
  },
  {
    pattern: /(ready|prepare|qualif).*(frontend|front.end|developer|role)/i,
    response: (ctx) => {
      const frontendSkills = ["react", "vue", "angular", "html", "css", "javascript", "typescript", "next.js"];
      const matched = frontendSkills.filter((s) =>
        [...ctx.skills, ...ctx.technologies].some((us) => us.toLowerCase().includes(s))
      );
      const ratio = matched.length / frontendSkills.length;

      let body: string;
      if (ratio >= 0.6) {
        body = "**You're well on your way!**\n\nYour profile shows strong frontend fundamentals. To feel fully prepared:\n- Strengthen **performance optimization** (Lighthouse, Core Web Vitals)\n- Learn **testing frameworks** (Jest, Cypress, Playwright)\n- Master **modern CSS** (Grid, Container Queries, Tailwind deeply)";
      } else if (ratio >= 0.3) {
        body = "**You have a good foundation.**\n\nFocus on:\n- Building **real projects** to demonstrate competence\n- Mastering **React/Next.js** — the most demanded frontend stack\n- Learning **TypeScript** — essential for production frontend code";
      } else {
        body = "**You're taking the first steps!**\n\nHere's a starter roadmap:\n1. Learn **HTML & CSS** fundamentals\n2. Master **JavaScript** (ES6+, async, DOM)\n3. Build projects with **React**\n4. Add **TypeScript** and **Next.js**";
      }

      return body + `\n\n_Frontend skills detected: ${matched.length}/${frontendSkills.length}_`;
    },
  },
  {
    pattern: /(roadmap|learning path|learn.*next|study plan)/i,
    response: (ctx) => {
      const hasFrontend = ctx.skills.some((s) => ["react", "vue", "angular"].includes(s));
      const hasBackend = ctx.skills.some((s) => ["node.js", "express", "python", "django"].includes(s));

      let roadmap = "Here is a personalized **3-month roadmap**:\n\n";

      if (hasFrontend && hasBackend) {
        roadmap += `**Month 1 — Deepen Full-Stack**\n- Advanced patterns in ${ctx.skills.filter(s => ["react", "vue", "angular", "node.js", "express"].includes(s)).join("/")}\n- Database optimization (indexing, query tuning)\n- CI/CD pipelines with GitHub Actions\n\n`;
        roadmap += "**Month 2 — Scale Up**\n- Microservices architecture\n- Message queues (RabbitMQ / Kafka)\n- Cloud deployment (AWS EC2, Lambda)\n\n";
        roadmap += "**Month 3 — Senior Prep**\n- System design interview prep\n- Monitoring & observability\n- Mentor junior developers & contribute to open source";
      } else if (hasFrontend) {
        roadmap += "**Month 1 — Frontend Mastery**\n- Advanced React patterns (render props, HOCs, hooks)\n- State management (Zustand / Redux Toolkit)\n- Testing with Jest + React Testing Library\n\n";
        roadmap += "**Month 2 — Backend Basics**\n- Node.js + Express fundamentals\n- REST API design\n- MongoDB + PostgreSQL\n\n";
        roadmap += "**Month 3 — Full Integration**\n- Build a full-stack project\n- Deploy with Vercel + Railway\n- TypeScript end-to-end";
      } else {
        roadmap += "**Month 1 — Foundations**\n- HTML, CSS, JavaScript fundamentals\n- Build 3 small projects\n- Git & GitHub workflow\n\n";
        roadmap += "**Month 2 — Framework Time**\n- Learn React or Next.js\n- Build a portfolio project\n- TypeScript basics\n\n";
        roadmap += "**Month 3 — Job Ready**\n- Full-stack project (add backend)\n- Polish your resume & portfolio\n- Practice interview questions";
      }

      return roadmap;
    },
  },
  {
    pattern: /(salary|compensation|pay|earn)/i,
    response: () =>
      "Salary expectations depend on location, experience, and company size.\n\n**Rough ranges (USD):**\n- **Junior (0-2 yrs):** $60K–$90K\n- **Mid (3-5 yrs):** $90K–$130K\n- **Senior (6+ yrs):** $130K–$200K+\n- **Staff/Principal:** $200K–$350K+\n\n💡 Pro tip: Always research market rates for your specific role and location on sites like Levels.fyi, Glassdoor, and Blind.",
  },
  {
    pattern: /interview|prepare.*(coding|technical)/i,
    response: (ctx) => {
      return "Here's an interview preparation plan:\n\n**1. Data Structures & Algorithms**\n- Arrays, Strings, Hash Tables, Trees, Graphs\n- Practice on **LeetCode** (150 problems minimum, focusing on Medium difficulty)\n\n**2. System Design** (for senior roles)\n- Scalability, load balancing, caching, database sharding\n- Practice designing: URL shortener, chat system, ride-sharing app\n\n**3. Behavioral Questions**\n- Use **STAR** method (Situation, Task, Action, Result)\n- Prepare stories about challenges, conflicts, and successes\n\n**4. Portfolio Review**\n- Ensure your best projects are live and well-documented\n- Be ready to walk through your code decisions\n\nCurrent strengths: **" + (ctx.skills.slice(0, 3).join(", ") || "None yet") + "** — highlight these in your answers.";
    },
  },
  {
    pattern: /hello|hi|hey|greetings/i,
    response: () =>
      "Hello! 👋 I'm your AI Career Mentor. I can help you with:\n\n- 📄 Resume improvement tips\n- 🛠️ Skill recommendations\n- 🎯 Career readiness assessment\n- 🗺️ Learning roadmaps\n- 💰 Salary insights\n- 🎤 Interview preparation\n\nWhat would you like to explore?",
  },
  {
    pattern: /(thank|thanks|appreciate)/i,
    response: () =>
      "You're welcome! 😊 Feel free to ask anytime. Building a great career is a journey — I'm here to help at every step.\n\nWhat else would you like to know?",
  },
  {
    pattern: /(portfolio|project|github)/i,
    response: () =>
      "Building a strong portfolio is key to landing interviews. Here's how:\n\n1. **Quality over quantity** — 3 solid projects > 10 trivial ones\n2. **Full-stack projects** — Show you can work across the stack\n3. **Real-world problems** — Build something people actually use\n4. **Documentation** — Good README, live demo, clean code\n5. **Open source contributions** — Great way to demonstrate collaboration\n\nWant suggestions for project ideas? Just ask!",
    },
];

const fallbackResponse = (ctx: ChatContext): string => {
  const lines = [
    "That's a great question! Here's what I can help with:\n",
    "- **Resume Review** — ask \"How can I improve my resume?\"\n",
    "- **Skill Guidance** — ask \"Which skills should I learn next?\"\n",
    "- **Career Check** — ask \"Am I ready for a developer role?\"\n",
    "- **Learning Plan** — ask \"Create a learning roadmap for me\"\n",
  ];

  if (ctx.skills.length > 0) {
    lines.push(`\nBased on your profile, you have skills in **${ctx.skills.slice(0, 5).join(", ")}**. Try asking something related to these!`);
  }

  return lines.join("\n");
};

export async function generateChatResponse(
  userId: string,
  message: string
): Promise<string> {
  const latestResume = await Resume.findOne({ userId }).sort({ createdAt: -1 });

  const context: ChatContext = {
    skills: latestResume?.extractedData?.skills || [],
    technologies: latestResume?.extractedData?.technologies || [],
    experience: latestResume?.extractedData?.experience || [],
    education: latestResume?.extractedData?.education || [],
    score: latestResume?.analysis?.score,
  };

  const resumeSummary = [
    `Skills: ${context.skills.join(", ") || "None listed"}`,
    `Technologies: ${context.technologies.join(", ") || "None listed"}`,
    `Experience: ${context.experience.join("; ") || "None listed"}`,
    `Education: ${context.education.join("; ") || "None listed"}`,
    `Resume Score: ${context.score ?? "N/A"}/100`,
  ].join("\n");

  const systemPrompt = `You are CareerPilot AI, a helpful career mentor assistant. 
You have access to the user's resume data below. Answer their career questions concisely and helpfully.
Use markdown formatting (bold, lists, code) where appropriate.

USER'S RESUME DATA:
${resumeSummary}`;

  const geminiReply = await generateWithGemini(systemPrompt, message);
  if (geminiReply) return geminiReply;

  for (const { pattern, response } of topicPatterns) {
    if (pattern.test(message)) {
      return response(context);
    }
  }

  return fallbackResponse(context);
}
