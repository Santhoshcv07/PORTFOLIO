"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import { ExternalLink, ArrowRight, BookOpen } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedProjects, getAllProjects, type Project } from "@/constants/projectsData";

/* ─── MacBook Device Frame ─── */
function MacBookShowcase({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D tilt on mouse move
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  // Reflection sweep position
  const reflectionX = useMotionValue(-100);
  const springReflectionX = useSpring(reflectionX, {
    stiffness: 80,
    damping: 25,
  });

  // Glow intensity
  const glowOpacity = useSpring(0, { stiffness: 120, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);

      rotateX.set(-y * 3);
      rotateY.set(x * 4);
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

  const isReversed = index % 2 !== 0;

  // Shadow that reacts to glow
  const boxShadow = useMotionTemplate`
    0 25px 60px rgba(0, 0, 0, 0.4),
    0 0 ${isHovered ? "80px" : "0px"} rgba(0, 217, 255, ${glowOpacity})
  `;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Ambient glow behind entire showcase */}
      <motion.div
        className="absolute -inset-20 rounded-[60px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,217,255,0.04) 0%, transparent 70%)",
          opacity: glowOpacity,
        }}
      />

      <div
        className={`flex flex-col ${
          isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
        } items-center gap-10 lg:gap-16 xl:gap-20`}
      >
        {/* ─── MacBook Device ─── */}
        <motion.div
          ref={cardRef}
          className="relative w-full lg:w-[62%] xl:w-[65%] flex-shrink-0"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: 1200,
          }}
        >
          <motion.div
            className="relative"
            style={{
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformStyle: "preserve-3d",
            }}
          >
            {/* MacBook Screen Body */}
            <motion.div
              className="relative rounded-[16px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 50%, #1e1e22 100%)",
                padding: "12px 12px 0 12px",
                boxShadow: boxShadow as unknown as string,
              }}
            >
              {/* Camera notch */}
              <div className="absolute top-[5px] left-1/2 -translate-x-1/2 z-20">
                <div className="w-[6px] h-[6px] rounded-full bg-[#1a1a1e] border border-[#333] shadow-inner" />
              </div>

              {/* Screen Bezel */}
              <div className="relative rounded-[8px] overflow-hidden bg-black">
                {/* Actual Screenshot */}
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    className={`object-cover object-top transition-all duration-700 ${
                      isHovered
                        ? "brightness-110 scale-[1.02]"
                        : "brightness-100 scale-100"
                    }`}
                    sizes="(max-width: 768px) 100vw, 65vw"
                    loading="lazy"
                  />

                  {/* Reflection sweep overlay */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background: useMotionTemplate`linear-gradient(105deg, transparent ${springReflectionX}%, rgba(255,255,255,0.04) ${springReflectionX}%, transparent ${springReflectionX}%)`,
                    }}
                  />

                  {/* Top screen light reflection */}
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 30%)",
                    }}
                  />

                  {/* Screen inner shadow for depth */}
                  <div className="absolute inset-0 pointer-events-none z-10 rounded-[8px] shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]" />
                </div>
              </div>

              {/* MacBook Hinge / Base */}
              <div className="relative h-[18px] flex items-center justify-center">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, #2a2a2e 0%, #222226 40%, #1c1c20 100%)",
                  }}
                />
                {/* Hinge indent */}
                <div className="relative z-10 w-[80px] h-[4px] rounded-full bg-[#333] shadow-inner" />
              </div>
            </motion.div>

            {/* MacBook Base Bottom (keyboard section visible part) */}
            <div
              className="relative h-[8px] mx-[8%] rounded-b-[8px]"
              style={{
                background:
                  "linear-gradient(180deg, #1c1c20 0%, #18181c 100%)",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
            />

            {/* Drop shadow / reflection on surface */}
            <div
              className="absolute -bottom-6 left-[10%] right-[10%] h-[20px] rounded-[50%] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />
          </motion.div>

          {/* Floating device glow */}
          <motion.div
            className="absolute -bottom-8 left-[15%] right-[15%] h-[30px] rounded-[50%] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(0,217,255,0.12) 0%, transparent 70%)",
              filter: "blur(20px)",
              opacity: glowOpacity,
            }}
          />
        </motion.div>

        {/* ─── Project Info ─── */}
        <div className="w-full lg:w-[38%] xl:w-[35%] flex flex-col gap-6">
          {/* Category tag */}
          <motion.div
            initial={{ opacity: 0, x: isReversed ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] uppercase tracking-[0.2em] text-primary/80 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              {project.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h3
            className="font-heading text-2xl md:text-3xl lg:text-[2.2rem] xl:text-4xl font-bold text-white leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 + index * 0.15 }}
          >
            {project.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-secondary-foreground text-sm md:text-[15px] leading-relaxed font-sans"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
          >
            {project.longDescription || project.description}
          </motion.p>

          {/* Separator */}
          <motion.div
            className="w-12 h-[1px] bg-gradient-to-r from-primary/50 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.45 + index * 0.15 }}
            style={{ transformOrigin: "left" }}
          />

          {/* Tech Stack */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
          >
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium text-white/60 bg-white/[0.04] border border-white/[0.06] hover:border-primary/30 hover:text-white/80 transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex items-center gap-3 pt-2"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.55 + index * 0.15 }}
          >
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/80 hover:border-primary/40 hover:text-white hover:bg-white/[0.06] transition-all duration-400 hover:shadow-[0_0_20px_rgba(0,217,255,0.08)]"
              data-magnetic="true"
            >
              <FiGithub
                size={15}
                className="group-hover:text-primary transition-colors duration-300"
              />
              <span>Source</span>
            </a>
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary/[0.08] border border-primary/20 text-sm font-medium text-primary/90 hover:bg-primary/[0.12] hover:border-primary/40 hover:text-primary transition-all duration-400 hover:shadow-[0_0_20px_rgba(0,217,255,0.12)]"
              data-magnetic="true"
            >
              <span>Live Demo</span>
              <ExternalLink
                size={14}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
              />
            </a>
            {project.caseStudy && (
              <a
                href={project.caseStudy}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-white/50 hover:text-white/80 transition-all duration-300"
                data-magnetic="true"
              >
                <BookOpen size={14} />
                <span>Case Study</span>
              </a>
            )}
          </motion.div>
        </div>
      </div>
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
      className="relative py-32 md:py-40 overflow-hidden"
    >
      {/* Subtle faint grid behind section */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Section ambient glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/[0.02] blur-[150px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 relative z-10">
        {/* ─── Section Header ─── */}
        <motion.div
          className="flex flex-col items-center text-center mb-28 md:mb-36"
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
              className="text-transparent bg-clip-text"
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
              background:
                "linear-gradient(90deg, transparent, rgba(0,217,255,0.3), transparent)",
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </motion.div>

        {/* ─── Featured Project Showcases ─── */}
        <div className="flex flex-col gap-28 md:gap-36 lg:gap-44">
          {featuredProjects.map((project, idx) => (
            <MacBookShowcase key={project.id} project={project} index={idx} />
          ))}
        </div>

        {/* ─── View All Projects CTA ─── */}
        <motion.div
          className="flex justify-center mt-28 md:mt-36"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link
            href="/projects"
            className="group relative flex items-center gap-4 px-8 py-4 rounded-full overflow-hidden transition-all duration-500"
            data-magnetic="true"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Hover background sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.06] to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />

            {/* Hover glow ring */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_0_1px_rgba(0,217,255,0.2),0_0_30px_rgba(0,217,255,0.08)]" />

            <span className="relative z-10 text-sm font-semibold text-white/80 group-hover:text-white tracking-wide transition-colors duration-300 font-button">
              View All Projects
            </span>

            <span className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.08] group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-400">
              <span className="text-xs font-bold text-white/60 group-hover:text-primary transition-colors duration-300">
                {totalProjects}
              </span>
            </span>

            <ArrowRight
              size={16}
              className="relative z-10 text-white/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
