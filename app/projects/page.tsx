import type { Metadata } from "next";
import AllProjects from "@/components/sections/AllProjects";

export const metadata: Metadata = {
  title: "All Projects | Santhosh CV — AI Engineer",
  description:
    "Explore the complete collection of projects by Santhosh CV — from AI-powered applications and data platforms to IoT systems and blockchain solutions.",
};

export default function ProjectsPage() {
  return <AllProjects />;
}
