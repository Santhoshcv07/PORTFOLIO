"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  m as motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  animate,
  useInView,
} from "framer-motion";
import { ExternalLink, ArrowRight, BookOpen, Star, Users, Zap, BrainCircuit, Activity } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedProjects, getAllProjects, type Project } from "@/constants/projectsData";

// --- Animated Number Component ---
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && ref.current) {
      animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (ref.current) {
            // Add comma formatting if needed, though for small numbers it's fine
            const formatted = Math.round(latest).toLocaleString();
            ref.current.textContent = `${prefix}${formatted}${suffix}`;
          }
        },
      });
    }
  }, [inView, value, prefix, suffix]);

  return <span ref={ref} className="font-mono tabular-nums">{prefix}0{suffix}</span>;
}

/* ─── MacBook Showcase Card ─── */
function MacBookShowcase({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "200px 0px 200px 0px" });
  const [isHovered, setIsHovered] = useState(false);

  // 3D tilt for the entire card
  const cardRotateX = useMotionValue(0);
  const cardRotateY = useMotionValue(0);
  const springCardX = useSpring(cardRotateX, { stiffness: 100, damping: 30 });
  const springCardY = useSpring(cardRotateY, { stiffness: 100, damping: 30 });

  // Spotlight position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springMouseY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!rectRef.current) return;
    const rect = rectRef.current;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Parallax Tilt (Max 3 degrees)
    const x = ((e.clientX - centerX) / (rect.width / 2)) * 3;
    const y = ((e.clientY - centerY) / (rect.height / 2)) * 3;
    cardRotateX.set(-y);
    cardRotateY.set(x);

    // Spotlight
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [cardRotateX, cardRotateY, mouseX, mouseY]);

  const handleMouseEnter = () => {
    if (containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    cardRotateX.set(0);
    cardRotateY.set(0);
    rectRef.current = null;
  };

  const isReversed = index % 2 !== 0;

  // Generate Dummy Premium Metrics & Tags based on category for the showcase
  const isAI = project.category.includes("AI");
  const metrics = [
    { icon: Star, value: 120 + index * 45, label: "Stars" },
    { icon: Users, value: 2400 + index * 1200, label: "Users", suffix: "+" },
    { icon: Zap, value: 98, label: "Lighthouse" },
    ...(isAI ? [{ icon: BrainCircuit, value: 4, label: "Models", suffix: "" }] : []),
  ];

  const aiTags = isAI ? ["🤖 LLM", "🧠 RAG", "⚡ FastAPI", "🔐 JWT"] : ["⚡ Perf", "🔐 Auth", "📊 Analytics"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
      className="relative group perspective-[2000px]"
    >
      {/* CSS Particles for Featured Projects */}
      {project.featured && (
        <div className="absolute inset-[-50px] pointer-events-none z-0">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/30 will-change-transform"
              style={{
                width: Math.random() * 3 + 1 + "px",
                height: Math.random() * 3 + 1 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animation: isInView ? `particle-drift ${15 + Math.random() * 15}s linear infinite` : 'none',
                animationDelay: `-${Math.random() * 15}s`,
                opacity: Math.random() * 0.5 + 0.2,
                boxShadow: "0 0 10px rgba(0,217,255,0.4)"
              }}
            />
          ))}
        </div>
      )}

      {/* Main Glass Card */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: springCardX,
          rotateY: springCardY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 w-full rounded-[40px] p-8 md:p-12 lg:p-16 border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.5)] transition-shadow duration-700 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_30px_80px_rgba(0,0,0,0.6),0_0_80px_rgba(0,217,255,0.1)] overflow-hidden"
      >
        {/* Animated Background AI Gradient */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
          <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent ${isInView ? 'animate-[ambient-breathe_10s_ease-in-out_infinite]' : ''}`} />
        </div>

        {/* Hover Spotlight (8% opacity) */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full pointer-events-none z-0 mix-blend-screen will-change-transform hidden md:block"
          style={{
            background: "radial-gradient(circle, rgba(0,217,255,0.08) 0%, transparent 50%)",
            x: springMouseX,
            y: springMouseY,
            translateX: "-50%",
            translateY: "-50%",
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Numbering & Badges */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 right-6 md:right-8 flex justify-between items-center z-20 pointer-events-none">
          <span className="font-heading text-3xl md:text-5xl font-light text-white/10 tracking-tighter">
            #{String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex gap-2 md:gap-3">
            <span className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-3 rounded-full bg-black/40 border border-white/10 text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shadow-[0_0_8px_rgba(0,217,255,0.8)]" />
              {project.featured ? "Featured" : "Production"}
            </span>
            {project.live && (
              <span className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-3 rounded-full bg-success/10 border border-success/20 text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-success font-medium backdrop-blur-md">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
                </span>
                Live
              </span>
            )}
          </div>
        </div>

        <div
          className={`relative z-10 flex flex-col ${
            isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
          } items-center gap-8 lg:gap-20 mt-16 md:mt-12`}
        >
          {/* ─── MacBook Device ─── */}
          <div
            className="relative w-full lg:w-[55%] xl:w-[60%] flex-shrink-0 perspective-[1200px]"
          >
            <div
              className={`relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isHovered ? "scale-[1.03]" : "scale-100"
              }`}
              style={{
                transform: isHovered ? `rotateY(${isReversed ? '2deg' : '-2deg'}) rotateX(1deg)` : "rotateY(0deg) rotateX(0deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* MacBook Screen Body */}
              <div
                className="relative rounded-[16px] overflow-hidden group/macbook cursor-none"
                style={{
                  background: "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 50%, #1e1e22 100%)",
                  padding: "12px 12px 0 12px",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)",
                }}
              >
                {/* Custom Cursor for MacBook hover */}
                <div className="absolute inset-0 z-50 pointer-events-none opacity-0 group-hover/macbook:opacity-100 transition-opacity duration-300 overflow-hidden hidden md:block">
                  <motion.div 
                    className="absolute w-24 h-24 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/50 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-widest text-center shadow-[0_0_20px_rgba(0,217,255,0.4)]"
                    style={{
                      x: springMouseX,
                      y: springMouseY,
                      translateX: "-50%",
                      translateY: "-50%",
                    }}
                  >
                    View<br/>Project
                  </motion.div>
                </div>

                {/* Camera notch */}
                <div className="absolute top-[5px] left-1/2 -translate-x-1/2 z-20">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#1a1a1e] border border-[#333] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
                </div>

                {/* Screen Bezel */}
                <div className="relative rounded-[8px] overflow-hidden bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                  <div className="relative aspect-[16/10] w-full">
                    {/* Image Loading Blur-Up */}
                    <Image
                      src={project.image}
                      alt={`${project.title} screenshot`}
                      fill
                      className={`object-cover object-top transition-all duration-1000 ${
                        isHovered ? "brightness-110" : "brightness-95"
                      }`}
                      sizes="(max-width: 768px) 100vw, 60vw"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    />

                    {/* Fast Hover Reflection Sweep */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover/macbook:opacity-20 group-hover/macbook:animate-[button-sweep_1.5s_ease-out] pointer-events-none z-10 hidden md:block" />

                    {/* Continuous Slow Reflection */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full ${isInView ? 'animate-[button-sweep_8s_linear_infinite]' : ''} pointer-events-none z-10 hidden md:block`} />

                    {/* Screen inner shadow for depth */}
                    <div className="absolute inset-0 pointer-events-none z-20 rounded-[8px] shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]" />
                  </div>
                </div>

                {/* MacBook Hinge */}
                <div className="relative h-[18px] flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#2a2a2e] to-[#1c1c20]" />
                  <div className="relative z-10 w-[80px] h-[4px] rounded-full bg-[#111] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
                </div>
              </div>

              {/* MacBook Base Bottom */}
              <div
                className="relative h-[8px] mx-[8%] rounded-b-[8px]"
                style={{
                  background: "linear-gradient(180deg, #1c1c20 0%, #0a0a0c 100%)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              />
            </div>
          </div>

          {/* ─── Project Info ─── */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-6 relative z-30">
            {/* Title */}
            <h3 className="font-heading text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-white leading-tight tracking-tight">
              {project.title}
            </h3>

            {/* Premium Metrics */}
            <div className="flex flex-wrap gap-4 pt-2">
              {metrics.map((m, i) => (
                <div key={i} className="flex items-center gap-2 bg-black/20 border border-white/5 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                  <m.icon size={12} className="text-primary/70" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-white font-bold text-sm">
                      <AnimatedNumber value={m.value} suffix={m.suffix} />
                    </span>
                    <span className="text-white/40 text-[10px] uppercase tracking-wider">{m.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className={`text-secondary-foreground text-[15px] leading-relaxed font-sans transition-colors duration-500 ${isHovered ? "text-white/80" : ""}`}>
              {project.longDescription || project.description}
            </p>

            {/* Separator */}
            <div className="w-full h-[1px] bg-gradient-to-r from-primary/30 via-white/10 to-transparent my-2" />

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="group/pill px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium text-white/60 bg-white/[0.04] border border-white/[0.06] hover:border-primary/50 hover:bg-primary/5 hover:text-white hover:shadow-[0_0_15px_rgba(0,217,255,0.2)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-default relative overflow-hidden"
                >
                  <span className="relative z-10">{tech}</span>
                  <div className="absolute inset-0 bg-primary/20 scale-0 group-hover/pill:scale-150 transition-transform duration-500 ease-out opacity-0 group-hover/pill:opacity-100 rounded-full" />
                </span>
              ))}
            </div>

            {/* AI Tags */}
            <div className="flex flex-wrap gap-2 mt-1">
              {aiTags.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-[9px] uppercase tracking-widest text-primary font-bold">
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 mt-auto">
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="group/btn relative flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white text-black font-button font-bold overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] active:scale-95"
                data-magnetic="true"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Live Demo
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-primary transition-transform duration-500 ease-out translate-y-[101%] group-hover/btn:translate-y-0 z-0" />
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-[button-sweep_1.5s_ease-in-out_infinite] z-0" />
              </a>

              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="group/btn relative flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-button font-medium overflow-hidden transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.08] hover:shadow-[0_10px_30px_rgba(0,217,255,0.1)] active:scale-95"
                data-magnetic="true"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FiGithub size={16} className="group-hover/btn:text-primary transition-colors" />
                  Source Code
                </span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Projects Section ─── */
export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuredProjects = getFeaturedProjects();
  const totalProjects = getAllProjects().length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative py-32 md:py-40 overflow-hidden bg-background"
    >
      {/* Subtle faint grid behind section */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Section ambient glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/[0.03] blur-[150px] pointer-events-none will-change-transform z-0" />

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 relative z-10">
        {/* ─── Section Header ─── */}
        <motion.div
          className="flex flex-col items-center text-center mb-28 md:mb-36 will-change-transform"
          style={{ y: titleY }}
        >
          <motion.span
            className="text-primary/60 font-mono text-xs tracking-[0.3em] mb-5 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            05
          </motion.span>

          <motion.h2
            className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="text-white">FEATURED </span>
            <span
              className="text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(0,217,255,0.3)]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #00D9FF 0%, #62EFFF 50%, #00D9FF 100%)",
              }}
            >
              PROJECTS
            </span>
          </motion.h2>

          <motion.p
            className="text-secondary-foreground text-base md:text-lg max-w-2xl font-sans leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            A curated selection of my flagship work — focusing on artificial
            intelligence, complex architectures, and exceptional user
            experiences.
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="mt-8 w-16 h-[1px]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,217,255,0.5), transparent)",
              boxShadow: "0 0 10px rgba(0,217,255,0.5)"
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </motion.div>

        {/* ─── Featured Project Showcases ─── */}
        <div className="flex flex-col gap-32 md:gap-40 lg:gap-48 relative">
          {/* Cyan Divider line connecting projects vertically */}
          <div className="absolute top-20 bottom-20 left-[4%] md:left-1/2 w-[1px] bg-gradient-to-b from-transparent via-primary/10 to-transparent -z-10" />
          
          {featuredProjects.map((project, idx) => (
            <div key={project.id} className="relative">
              <MacBookShowcase project={project} index={idx} />
            </div>
          ))}
        </div>

        {/* ─── View All Projects CTA ─── */}
        <motion.div
          className="flex justify-center mt-32 md:mt-40"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link
            href="/projects"
            className="group relative flex items-center gap-4 px-8 py-5 rounded-2xl overflow-hidden transition-all duration-500 bg-white/[0.02] border border-white/10 hover:border-primary/40 hover:bg-white/[0.04] shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_30px_rgba(0,217,255,0.15)] active:scale-95"
            data-magnetic="true"
          >
            {/* Hover background sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.06] to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />

            <span className="relative z-10 text-sm font-bold text-white/80 group-hover:text-white tracking-wide transition-colors duration-300 font-button uppercase">
              View All Projects
            </span>

            <span className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-400">
              <span className="text-xs font-bold text-white/60 group-hover:text-primary transition-colors duration-300">
                {totalProjects}
              </span>
            </span>

            <ArrowRight
              size={18}
              className="relative z-10 text-white/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
