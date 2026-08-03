import Hero from "@/components/sections/Hero";
import dynamic from "next/dynamic";
import LazySection from "@/components/layout/LazySection";

const About = dynamic(() => import("@/components/sections/About"));
const TechStack = dynamic(() => import("@/components/sections/TechStack"));
const Experience = dynamic(() => import("@/components/sections/Experience"));
const Education = dynamic(() => import("@/components/sections/Education"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const Certificates = dynamic(() => import("@/components/sections/Certificates"));
const Contact = dynamic(() => import("@/components/sections/Contact"));

export default function Home() {
  return (
    <>
      <Hero />
      <LazySection><About /></LazySection>
      <LazySection><TechStack /></LazySection>
      <LazySection><Experience /></LazySection>
      <LazySection><Education /></LazySection>
      <LazySection><Projects /></LazySection>
      <LazySection><Certificates /></LazySection>
      <LazySection><Contact /></LazySection>
    </>
  );
}
