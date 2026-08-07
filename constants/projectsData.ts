export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  tech: string[];
  github: string;
  live: string;
  caseStudy?: string;
  featured: boolean;
  category: string;
  year: string;
}

export const projects: Project[] = [
  {
    id: "devpilot-ai",
    title: "DevPilot AI",
    description:
      "An intelligent developer assistant that bridges the gap between large codebases and natural language understanding with an interactive AI pair programmer.",
    longDescription:
      "Built a robust AI pair programmer with deep local workspace integration, allowing users to converse with advanced LLMs to debug, generate, and understand code instantly. Features an in-app Monaco editor, secure JWT authentication, and a sleek UI leveraging Next.js and Tailwind CSS.",
    image: "/assets/projects/devpilot_ai.webp",
    tech: ["Next.js", "TypeScript", "Tailwind", "Python", "FastAPI", "PostgreSQL"],
    github: "https://github.com/Santhoshcv07/DevPilot_AI",
    live: "https://dev-pilot-ai-hazel.vercel.app",
    featured: true,
    category: "AI / Developer Tools",
    year: "2024",
  },
  {
    id: "mockmate-ai",
    title: "MockMate AI",
    description:
      "Your ultimate AI-powered mock interview & resume assistant. Conducts realistic, role-specific mock interviews using Groq and Google GenAI.",
    longDescription:
      "A comprehensive platform designed to help job seekers crack their dream interviews. Features AI mock interviews, a resume analyzer with keyword extraction and scoring, a 3D interactive UI, and a performance dashboard for tracking progress over time.",
    image: "/assets/projects/mockmate_ai.webp",
    tech: ["Next.js", "React", "Tailwind CSS", "Supabase", "Three.js", "GenAI"],
    github: "https://github.com/Santhoshcv07/MockMate-AI",
    live: "https://mock-mate-ai-tau-two.vercel.app",
    featured: true,
    category: "AI / EdTech",
    year: "2024",
  },
  {
    id: "ai-content-creator",
    title: "AI Content Creator",
    description:
      "Next-generation AI-powered content generation platform leveraging Google Gemini to create, manage, and export high-quality content.",
    longDescription:
      "A full-stack application designed to streamline the content creation process. Features robust user authentication via Supabase, seamless Markdown rendering, instant PDF exports, data visualization, and a beautiful UI built with Tailwind CSS and Framer Motion.",
    image:"/assets/projects/ai_content_creator.webp",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Gemini AI"],
    github: "https://github.com/Santhoshcv07/AI-Content-Creator.git",
    live: "https://ai-content-creator-swart.vercel.app",
    featured: true,
    category: "AI / SaaS",
    year: "2024",
  },
  {
    id: "promptfix-ai",
    title: "PromptFix AI",
    description:
      "Intelligent assistant that transforms basic, unoptimized prompts into highly effective instructions for LLMs using a meta-prompting strategy.",
    longDescription:
      "An intelligent assistant designed to elevate ordinary prompts into powerful, precision-engineered AI instructions. Built with a fast Python/FastAPI backend and a modern Next.js frontend, it leverages Llama-3.1 via Groq for high-quality prompt generation.",
    image: "/assets/projects/promptfix_ai.webp",
    tech: ["Next.js", "Tailwind CSS", "FastAPI", "Python", "Groq"],
    github: "https://github.com/Santhoshcv07/PromptFix_AI.git",
    live: "https://prompt-fix-ai.vercel.app",
    featured: false,
    category: "AI / Tools",
    year: "2024",
  },
  {
    id: "food-orbit",
    title: "FoodOrbit",
    description:
      "Real-time food rescue & logistics platform connecting event organizers, NGOs, and farmers to eliminate food waste.",
    longDescription:
      "An intelligent, cloud-based ecosystem designed to tackle the global problem of food waste. Features a live dashboard, AI-powered sustainability recommendations via Groq, and a role-based claim workflow prioritizing human consumption, animal feed, and composting.",
    image: "/assets/projects/food_orbit.webp",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase", "Groq AI"],
    github: "https://github.com/Santhoshcv07/Food-Orbit.git",
    live: "https://food-orbit.vercel.app",
    featured: false,
    category: "Tech for Good",
    year: "2024",
  },
  {
    id: "vibesync-ai",
    title: "VibeSync AI",
    description:
      "A personalized, AI-powered entertainment discovery platform that creates tailored sessions based on your mood, time, and energy.",
    longDescription:
      "Solves the paradox of choice by generating a perfect blend of entertainment to match your current feeling. Curates music, time-aware movies, books, and visual moodboards using an AI engine (Groq/LLM) powered by a fast FastAPI and PostgreSQL backend.",
    image: "/assets/projects/vibesync_ai.webp",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "FastAPI", "PostgreSQL"],
    github: "https://github.com/Santhoshcv07/VibeSync_AI.git",
    live: "https://vibe-sync-ai-xi.vercel.app",
    featured: false,
    category: "AI / Entertainment",
    year: "2024",
  },
  {
    id: "highway-crash-game",
    title: "Highway Crash Game",
    description:
      "An exhilarating, fast-paced 3D endless runner racing game where players dodge traffic in an endlessly generating city.",
    longDescription:
      "A 3D endless racing game built with Unity and C#. Features an integrated garage for car selection, dynamic traffic spawning, and a highly optimized procedural environment generation system. Fully playable in the web browser via WebGL.",
    image: "/assets/projects/highway_crash.webp",
    tech: ["Unity", "C#", "WebGL", "LeanTween"],
    github: "https://github.com/Santhoshcv07/Highway-Crash-Game.git",
    live: "https://santhu771.itch.io/highway-crash-game",
    featured: false,
    category: "Game Development",
    year: "2024",
  },
  {
    id: "smart-budget-tracker",
    title: "Smart Budget Tracker",
    description:
      "Your personal financial command center for tracking, analyzing, and optimizing your expenses.",
    longDescription:
      "A full-stack web application providing a secure, intuitive interface to record daily expenses and categorize spending. Features real-time tracking, personalized monthly budgets, interactive data visualization, and PDF/CSV export capabilities.",
    image: "/assets/projects/smart_budget_tracker.webp",
    tech: ["React", "Vite", "Node.js", "Express", "PostgreSQL"],
    github: "https://github.com/Santhoshcv07/smart-budget-tracker.git",
    live: "https://smart-budget-tracker-two.vercel.app",
    featured: false,
    category: "Finance / Full Stack",
    year: "2024",
  },
  {
    id: "project-manager",
    title: "ProjectManager",
    description:
      "A full-stack project management web application for organizing tasks and tracking team progress.",
    longDescription:
      "A comprehensive task and project tracking solution that provides a centralized dashboard to oversee active projects, break them down into actionable tasks, and assign statuses. Built on a modern MERN stack with secure JWT authentication and a fast, responsive UI.",
    image: "/assets/projects/project_manager.webp",
    tech: ["React", "Vite", "Node.js", "Express", "MongoDB"],
    github: "https://github.com/Santhoshcv07/ProjectManager.git",
    live: "https://project-manager-beta-ten.vercel.app/",
    featured: false,
    category: "Productivity / Full Stack",
    year: "2024",
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getAllProjects(): Project[] {
  return projects;
}
