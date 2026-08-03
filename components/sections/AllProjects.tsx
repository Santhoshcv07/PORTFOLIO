"use client";

import { useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import { ExternalLink, ArrowLeft, BookOpen } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { getAllProjects, type Project } from "@/constants/projectsData";

/* ─── Compact MacBook Card for Grid ─── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 180, damping: 22 });
  const springRotateY = useSpring(rotateY, { stiffness: 180, damping: 22 });

  const reflectionX = useMotionValue(-100);
  const springReflectionX = useSpring(reflectionX, {
    stiffness: 80,
    damping: 25,
  });

  const glowOpacity = useSpring(0, { stiffness: 120, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);

      rotateX.set(-y * 4);
      rotateY.set(x * 5);
      reflectionX.set(((e.clientX - rect.left) / rect.width) * 200 - 50);
    },
    [rotateX, rotateY, reflectionX]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    glowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    reflectionX.set(-100);
    glowOpacity.set(0);
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: (index % 2) * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute -inset-10 rounded-[40px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,217,255,0.03) 0%, transparent 70%)",
          opacity: glowOpacity,
        }}
      />

      <div
        ref={cardRef}
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1000 }}
      >
        <motion.div
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Glass container */}
          <div
            className="relative rounded-[20px] overflow-hidden transition-all duration-500"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: isHovered
                ? "0 30px 60px rgba(0,0,0,0.4), 0 0 60px rgba(0,217,255,0.06)"
                : "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            {/* MacBook Frame */}
            <div
              className="relative rounded-t-[14px] overflow-hidden mx-3 mt-3"
              style={{
                background:
                  "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 50%, #1e1e22 100%)",
                padding: "8px 8px 0 8px",
              }}
            >
              {/* Camera */}
              <div className="absolute top-[3px] left-1/2 -translate-x-1/2 z-20">
                <div className="w-[4px] h-[4px] rounded-full bg-[#1a1a1e] border border-[#333]" />
              </div>

              {/* Screen */}
              <div className="relative rounded-[6px] overflow-hidden bg-black">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    className={`object-cover object-top transition-all duration-700 ${
                      isHovered
                        ? "brightness-110 scale-[1.03]"
                        : "brightness-100 scale-100"
                    }`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />

                  {/* Reflection sweep */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background: useMotionTemplate`linear-gradient(105deg, transparent ${springReflectionX}%, rgba(255,255,255,0.05) ${springReflectionX}%, transparent ${springReflectionX}%)`,
                    }}
                  />

                  {/* Top light */}
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 25%)",
                    }}
                  />

                  <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]" />
                </div>
              </div>

              {/* Hinge */}
              <div className="relative h-[12px] flex items-center justify-center">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, #2a2a2e 0%, #1c1c20 100%)",
                  }}
                />
                <div className="relative z-10 w-[50px] h-[3px] rounded-full bg-[#333] shadow-inner" />
              </div>
            </div>

            {/* Base */}
            <div
              className="h-[5px] mx-[12%] rounded-b-[6px]"
              style={{
                background:
                  "linear-gradient(180deg, #1c1c20 0%, #18181c 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
            />

            {/* ─── Project Info ─── */}
            <div className="p-6 pt-5">
              {/* Category + Year */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-primary/60 font-medium">
                  <span className="w-1 h-1 rounded-full bg-primary/50" />
                  {project.category}
                </span>
                <span className="text-[10px] text-white/25 font-mono">
                  {project.year}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading text-lg md:text-xl font-bold text-white mb-2 leading-snug tracking-tight group-hover:text-primary transition-colors duration-300">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-secondary-foreground text-xs leading-relaxed mb-4 font-sans line-clamp-2">
                {project.description}
              </p>

              {/* Tech */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tech.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-[0.12em] font-medium text-white/50 bg-white/[0.03] border border-white/[0.05]"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 4 && (
                  <span className="px-2.5 py-1 rounded-full text-[9px] text-white/30 bg-white/[0.02]">
                    +{project.tech.length - 4}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-white/70 hover:border-primary/30 hover:text-white transition-all duration-300"
                  data-magnetic="true"
                >
                  <FiGithub size={13} />
                  <span>Source</span>
                </a>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/[0.06] border border-primary/15 text-xs font-medium text-primary/80 hover:bg-primary/[0.1] hover:border-primary/30 hover:text-primary transition-all duration-300"
                  data-magnetic="true"
                >
                  <span>Live Demo</span>
                  <ExternalLink size={12} />
                </a>
                {project.caseStudy && (
                  <a
                    href={project.caseStudy}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs text-white/40 hover:text-white/70 transition-colors duration-300"
                    data-magnetic="true"
                  >
                    <BookOpen size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Drop shadow */}
        <div
          className="absolute -bottom-4 left-[12%] right-[12%] h-[15px] rounded-[50%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─── All Projects Page ─── */
export default function AllProjects() {
  const allProjects = getAllProjects();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 0.3], [30, 0]);

  return (
    <section ref={containerRef} className="relative pt-36 pb-32 overflow-hidden min-h-screen">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.012] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-primary/[0.015] blur-[180px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 relative z-10">
        {/* ─── Back Navigation ─── */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-3 text-sm text-white/50 hover:text-white/80 transition-colors duration-300"
            data-magnetic="true"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] group-hover:border-primary/30 group-hover:bg-primary/[0.06] transition-all duration-300">
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-0.5 transition-transform duration-300"
              />
            </span>
            <span className="font-medium tracking-wide">Back to Home</span>
          </Link>
        </motion.div>

        {/* ─── Page Header ─── */}
        <motion.div
          className="text-center mb-20 md:mb-28"
          style={{ y: titleY }}
        >
          <motion.span
            className="text-primary/50 font-mono text-xs tracking-[0.3em] mb-5 block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            PORTFOLIO
          </motion.span>

          <motion.h1
            className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="text-white">ALL </span>
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #00D9FF 0%, #62EFFF 50%, #00D9FF 100%)",
              }}
            >
              PROJECTS
            </span>
          </motion.h1>

          <motion.p
            className="text-secondary-foreground text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Explore the complete collection — {allProjects.length} projects
            spanning AI, full-stack development, IoT, Web3, and beyond.
          </motion.p>

          <motion.div
            className="mt-8 mx-auto w-16 h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,217,255,0.3), transparent)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {/* Project count badge */}
          <motion.div
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
            <span className="text-xs text-white/50 tracking-wider font-medium">
              {allProjects.length} PROJECTS
            </span>
          </motion.div>
        </motion.div>

        {/* ─── Projects Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {allProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>

        {/* ─── Back to Home Footer CTA ─── */}
        <motion.div
          className="flex justify-center mt-24 md:mt-32"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Link
            href="/#projects"
            className="group relative flex items-center gap-3 px-7 py-3.5 rounded-full overflow-hidden transition-all duration-500"
            data-magnetic="true"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.06] to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_0_1px_rgba(0,217,255,0.2),0_0_25px_rgba(0,217,255,0.06)]" />

            <ArrowLeft
              size={15}
              className="relative z-10 text-white/40 group-hover:text-primary group-hover:-translate-x-1 transition-all duration-300"
            />
            <span className="relative z-10 text-sm font-semibold text-white/80 group-hover:text-white tracking-wide transition-colors duration-300 font-button">
              Back to Home
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
