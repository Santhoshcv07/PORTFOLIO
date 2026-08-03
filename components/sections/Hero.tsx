"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { m as motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import Image from "next/image";
import heroImg from "@/public/assets/images/portrait_new.png";

// ─── Canvas Particle System ─────────────────────────────────────────
function useParticleCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, mouseRef: React.RefObject<{x: number, y: number}>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Pre-render particle sprite (massive performance gain)
    const spriteCanvas = document.createElement("canvas");
    const spriteSize = 20; // max size * 3 * 2 approx
    spriteCanvas.width = spriteSize;
    spriteCanvas.height = spriteSize;
    const sCtx = spriteCanvas.getContext("2d");
    if (sCtx) {
      const center = spriteSize / 2;
      const gradient = sCtx.createRadialGradient(center, center, 0, center, center, center);
      gradient.addColorStop(0, `rgba(0, 217, 255, 1)`);
      gradient.addColorStop(1, `rgba(0, 217, 255, 0)`);
      sCtx.fillStyle = gradient;
      sCtx.arc(center, center, center, 0, Math.PI * 2);
      sCtx.fill();
      
      // Core dot
      sCtx.beginPath();
      sCtx.fillStyle = `rgba(255, 255, 255, 1)`;
      sCtx.arc(center, center, center * 0.2, 0, Math.PI * 2);
      sCtx.fill();
    }

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animId);
          draw();
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Particles
    interface Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; baseOpacity: number; pulse: number; pulseSpeed: number;
    }
    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2,
        baseOpacity: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    const neuralNodes = particles.slice(0, 12);

    const draw = () => {
      if (!isVisible) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Draw neural connections
      let connectionCount = 0;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < neuralNodes.length && connectionCount < 8; i++) {
        for (let j = i + 1; j < neuralNodes.length && connectionCount < 8; j++) {
          const dx = neuralNodes[i].x - neuralNodes[j].x;
          const dy = neuralNodes[i].y - neuralNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 250) {
            const alpha = (1 - dist / 250) * 0.06;
            ctx.beginPath();
            ctx.moveTo(neuralNodes[i].x, neuralNodes[i].y);
            ctx.lineTo(neuralNodes[j].x, neuralNodes[j].y);
            ctx.strokeStyle = `rgba(0, 217, 255, ${alpha})`;
            ctx.stroke();
            connectionCount++;
          }
        }
      }

      // Draw particles using pre-rendered sprite
      const mx = mouseRef.current?.x ?? 0;
      const my = mouseRef.current?.y ?? 0;

      for (const p of particles) {
        p.pulse += p.pulseSpeed;
        const currentOpacity = p.baseOpacity * (0.6 + 0.4 * Math.sin(p.pulse));
        
        // Mouse repulsion
        const dmx = p.x - mx;
        const dmy = p.y - my;
        const mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
        if (mouseDist < 100 && mouseDist > 0) {
          p.x += (dmx / mouseDist) * 0.3;
          p.y += (dmy / mouseDist) * 0.3;
        }

        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;

        // Draw Sprite
        ctx.globalAlpha = currentOpacity;
        const renderSize = p.size * 6; // size * 3 * 2
        ctx.drawImage(spriteCanvas, p.x - renderSize / 2, p.y - renderSize / 2, renderSize, renderSize);
      }
      ctx.globalAlpha = 1.0;

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [canvasRef, mouseRef]);
}

// ─── Rotating Subtitle Hook ─────────────────────────────────────────
const subtitles = ["AI Engineer", "AI Builder", "Machine Learning", "Automation"];
function useRotatingText(interval = 4000) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % subtitles.length), interval);
    return () => clearInterval(timer);
  }, [interval]);
  return subtitles[index];
}

// ─── Binary Numbers Data ────────────────────────────────────────────
const binaryStrings = [
  { text: "10100101", x: "8%", y: "15%", delay: 0 },
  { text: "00110100", x: "85%", y: "25%", delay: 4 },
  { text: "01011010", x: "12%", y: "70%", delay: 8 },
  { text: "11001011", x: "78%", y: "80%", delay: 12 },
  { text: "01110001", x: "55%", y: "12%", delay: 6 },
];

// ─── Stagger Config ─────────────────────────────────────────────────
const stagger = {
  grid: 0,
  radar: 0.15,
  portrait: 0.3,
  bgText: 0.35,
  headline: 0.6,
  headlineLine2: 0.75,
  headlineLine3: 0.85,
  accentLine: 0.95,
  description: 1.0,
  buttons: 1.1,
  socials: 1.2,
  status: 1.3,
  metrics: 1.6,
  scroll: 1.4,
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rawMouse = useRef({ x: 0, y: 0 });
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const currentSubtitle = useRotatingText(4000);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 20;
    const y = (e.clientY / innerHeight - 0.5) * 20;
    rawMouseX.set(x);
    rawMouseY.set(y);
    rawMouse.current = { x: e.clientX, y: e.clientY };
  }, [rawMouseX, rawMouseY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Canvas particles
  useParticleCanvas(canvasRef, rawMouse);

  const mouseX = useSpring(rawMouseX, { stiffness: 50, damping: 10 });
  const mouseY = useSpring(rawMouseY, { stiffness: 50, damping: 10 });

  // Parallax for different layers
  const textX = useTransform(mouseX, (x) => x * 0.5);
  const textY = useTransform(mouseY, (y) => y * 0.5);
  const portraitX = useTransform(mouseX, (x) => -x * 0.4);
  const portraitY = useTransform(mouseY, (y) => -y * 0.4);
  const ringX = useTransform(mouseX, (x) => x * 0.2);
  const ringY = useTransform(mouseY, (y) => y * 0.2);
  const particleX = useTransform(mouseX, (x) => x * 0.15);
  const particleY = useTransform(mouseY, (y) => y * 0.15);

  // Cursor glow position
  const cursorGlowX = useSpring(0, { stiffness: 80, damping: 15 });
  const cursorGlowY = useSpring(0, { stiffness: 80, damping: 15 });

  useEffect(() => {
    const updateGlow = (e: MouseEvent) => {
      cursorGlowX.set(e.clientX);
      cursorGlowY.set(e.clientY);
    };
    window.addEventListener("mousemove", updateGlow);
    return () => window.removeEventListener("mousemove", updateGlow);
  }, [cursorGlowX, cursorGlowY]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background hero-grain"
    >


      {/* ═══ ANIMATED GRID (Item #1) ═══ */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 50%,#000 20%,transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 50%,#000 20%,transparent 100%)",
          animation: "grid-pulse 8s ease-in-out infinite",
          willChange: "opacity",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: stagger.grid }}
      />

      {/* ═══ CANVAS PARTICLES + NEURAL LINES (Items #1, #10) ═══ */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ x: particleX, y: particleY }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ willChange: "transform" }}
        />
      </motion.div>

      {/* ═══ BINARY NUMBERS (Item #18) ═══ */}
      {binaryStrings.map((b, i) => (
        <div
          key={i}
          className="absolute font-mono text-[10px] text-white/[0.04] pointer-events-none z-[1] select-none hidden md:block"
          style={{
            left: b.x,
            top: b.y,
            animation: `binary-fade 12s ease-in-out ${b.delay}s infinite`,
          }}
        >
          {b.text}
        </div>
      ))}

      {/* ═══ ORBIT RINGS + RADAR (Items #2, #10) ═══ */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        style={{ x: ringX, y: ringY, willChange: "transform" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: stagger.radar, ease: "easeOut" }}
      >
        {/* Ring 1 */}
        <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full border-[0.5px] border-primary/20 animate-[spin_40s_linear_infinite]" />
        {/* Ring 2 */}
        <div className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full border-[0.5px] border-primary/10 animate-[spin_60s_linear_infinite_reverse]">
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_#00d9ff]" />
        </div>
        {/* Ring 3 */}
        <div className="absolute w-[800px] h-[800px] md:w-[1000px] md:h-[1000px] rounded-full border-[0.5px] border-primary/5 animate-[spin_80s_linear_infinite]" />

        {/* Scanning Ring (Item #2) */}
        <div
          className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-primary/30 pointer-events-none"
          style={{ animation: "scan-ring 4s ease-out infinite" }}
        />
      </motion.div>

      {/* ═══ HUGE BACKGROUND TEXT (Item #5) ═══ */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-10 flex flex-col items-center justify-center"
        style={{ y: y1, x: textX, opacity, willChange: "transform, opacity" }}
      >
        <motion.h1
          className="font-hero text-[120px] sm:text-[180px] md:text-[220px] lg:text-[280px] leading-none tracking-tighter font-bold whitespace-nowrap select-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 30%, rgba(0,217,255,0.3) 50%, rgba(255,255,255,0.6) 70%, rgba(255,255,255,0.9) 100%)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 20px rgba(0,217,255,0.08))",
            animation: "shine-sweep 8s linear infinite",
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 1.5, delay: stagger.bgText, ease: "easeOut" }}
        >
          SANTHOSH CV
        </motion.h1>
      </motion.div>

      {/* ═══ CENTER PORTRAIT (Items #3, #4, #9, #16, #23) ═══ */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex justify-center items-end"
        style={{ x: portraitX, y: portraitY, willChange: "transform" }}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: stagger.portrait, ease: "easeOut" }}
          className="relative w-[350px] md:w-[450px] lg:w-[500px] h-[450px] md:h-[600px] lg:h-[700px]"
          style={{ animation: "float-portrait 8s ease-in-out infinite" }}
        >
          {/* Very subtle ambient glow — no visible ring */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 40%, rgba(0,217,255,0.05) 0%, transparent 55%)",
              transform: "translateY(-5%) scale(1.1)",
              animation: "ambient-breathe 6s ease-in-out infinite",
              willChange: "opacity, transform",
            }}
          />

          {/* Radial Shadow Under Portrait (Item #9) */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[30px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)",
              filter: "blur(15px)",
            }}
          />

          <div
            className="w-full h-full relative"
            style={{
              maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
            }}
          >
            {/* Portrait Image with enhanced quality (Item #23) */}
            <Image
              src={heroImg}
              alt="Santhosh CV Portrait"
              fill
              placeholder="blur"
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-top transition-transform duration-1000"
              style={{
                filter: "contrast(1.05) brightness(1.02)",
              }}
            />

            {/* Hair Light Sweep (Item #4) */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ clipPath: "ellipse(40% 35% at 50% 25%)" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(0,217,255,0.12) 45%, rgba(255,255,255,0.08) 50%, rgba(0,217,255,0.12) 55%, transparent 100%)",
                  animation: "hair-sweep 7s ease-in-out infinite",
                  willChange: "transform",
                }}
              />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </motion.div>

      {/* ═══ UI OVERLAY LAYERS ═══ */}
      <div className="absolute inset-0 w-full max-w-[1600px] mx-auto px-10 md:px-10 lg:px-16 flex flex-col md:flex-row justify-between items-end md:items-center z-30 pointer-events-none pt-[80px] pb-[40px]">

        {/* ── LEFT COLUMN ── */}
        <div className="relative flex flex-col h-full justify-between w-full md:w-1/3 pb-10 md:pb-12 pointer-events-auto items-start">

          {/* Top Block: Pills & Heading */}
          <div>
            {/* Pills */}
            <motion.div
              className="flex flex-wrap gap-2 mb-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: stagger.socials }}
            >
              {["AI ENGINEER", "FULL STACK", "AI AUTOMATION"].map((skill) => (
                <div key={skill} className="group flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(0,217,255,0.2)] transition-all duration-300 cursor-default" data-magnetic="true">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:animate-pulse shadow-[0_0_5px_#00d9ff]" />
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">{skill}</span>
                </div>
              ))}
            </motion.div>

            {/* ── Headline (Items #6, #7) ── */}
            <div>
              <motion.h2
                className="font-heading text-base md:text-lg lg:text-xl tracking-[0.15em] text-white/70 mb-1"
                initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.7, delay: stagger.headline }}
              >
                BUILDING AI
              </motion.h2>
              <motion.h2
                className="font-heading text-xl md:text-2xl lg:text-3xl tracking-[0.15em] font-bold uppercase"
                initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.7, delay: stagger.headlineLine2 }}
              >
                <span className="text-primary drop-shadow-[0_0_10px_rgba(0,217,255,0.3)]">INTELLIGENT</span>
              </motion.h2>
              <motion.h2
                className="font-heading text-xl md:text-2xl lg:text-3xl tracking-[0.15em] font-bold uppercase mb-3"
                initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.7, delay: stagger.headlineLine3 }}
              >
                <span className="text-white">SOLUTIONS</span>
              </motion.h2>

              {/* Animated Accent Line (Item #7) */}
              <motion.div
                className="h-[2px] bg-gradient-to-r from-primary to-transparent my-4"
                initial={{ width: 0 }}
                animate={{ width: "2.5rem" }}
                transition={{ duration: 0.8, delay: stagger.accentLine, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Vertical Tech Text */}
          <div className="absolute -left-2 lg:-left-6 top-[40%] -translate-y-1/2 hidden md:flex items-center justify-start pointer-events-none opacity-60">
            <div
              className="text-[7px] lg:text-[8px] tracking-[0.25em] text-white/50 uppercase font-sans whitespace-nowrap"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              NEXT.JS • REACT • TYPESCRIPT • FASTAPI
            </div>
          </div>

          {/* ── Bottom Left: Profile Info (Items #11, #12, #15) ── */}
          <motion.div
            className="mb-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: stagger.description }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-transparent border-[2px] border-primary flex items-center justify-center p-[2px]">
                <span className="w-full h-full bg-primary rounded-full" />
              </span>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white font-semibold">HELLO, I&apos;M</span>
            </div>
            <h3 className="font-sans text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 tracking-tight">Santhosh CV</h3>

            {/* Rotating Subtitle (Item #15) */}
            <div className="h-6 md:h-7 relative overflow-hidden mb-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSubtitle}
                  className="text-primary text-xs md:text-sm font-medium tracking-wide drop-shadow-[0_0_8px_rgba(0,217,255,0.4)] absolute"
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                  transition={{ duration: 0.5 }}
                >
                  {currentSubtitle} & Full Stack Developer
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="text-secondary-foreground text-[10px] md:text-xs leading-relaxed max-w-[260px] md:max-w-[300px] mb-6 font-sans">
              Building intelligent AI applications, scalable software, and modern digital experiences focused on performance and real-world impact.
            </p>

            {/* Social Icons (Item #11) */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: stagger.socials }}
            >
              {[
                { icon: FiGithub, href: "https://github.com/Santhoshcv07" },
                { icon: FiLinkedin, href: "https://www.linkedin.com/in/santhosh-cv07" },
                { icon: Mail, href: "mailto:santhoshcv825@gmail.com" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="relative w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-primary/20 hover:border-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,217,255,0.3),inset_0_0_10px_rgba(0,217,255,0.1)] social-icon-ripple"
                  data-magnetic="true"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="hidden md:flex flex-col h-full justify-between items-end w-1/3 pb-10 md:pb-12 pointer-events-auto text-right">

          {/* ── Status Badge (Item #8) ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: stagger.status }}
          >
            <div className="flex items-center gap-2 justify-end mb-2 group">
              <span className="text-[11px] uppercase tracking-[0.15em] text-white font-medium group-hover:text-primary transition-colors">AVAILABLE FOR WORK</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span
                  className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"
                  style={{ animation: "dot-pulse-status 2s ease-in-out infinite, glow-pulse 2s ease-in-out infinite" }}
                />
              </span>
            </div>
            <p className="text-[9px] tracking-[0.2em] text-white/40 uppercase">LET&apos;S BUILD SOMETHING GREAT</p>
          </motion.div>

          {/* ── Scroll Indicator (Item #14) ── */}
          <motion.div
            className="flex flex-col items-center gap-6 absolute right-6 lg:right-16 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: stagger.scroll }}
          >
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center p-1 relative">
              <div className="absolute inset-0 rounded-full border border-primary/40 animate-[spin_4s_linear_infinite]" style={{ borderTopColor: "transparent", borderLeftColor: "transparent" }} />
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#00d9ff]"
                animate={{ y: [-6, 6, -6], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 rotate-90 my-10 font-bold">SCROLL</span>
            <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
              <motion.div
                className="w-full h-1/2 bg-primary absolute top-0 shadow-[0_0_8px_#00d9ff]"
                animate={{ top: ["-50%", "150%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              {/* Glowing dot on scroll line */}
              <div
                className="absolute w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_#00d9ff] left-1/2 -translate-x-1/2"
                style={{ animation: "scroll-dot 3s ease-in-out infinite" }}
              />
            </div>
          </motion.div>

          {/* ── Buttons (Items #12, #13) ── */}
          <motion.div
            className="flex flex-col items-end gap-6 mb-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: stagger.buttons }}
          >
            {/* View Projects (Item #13) */}
            <a
              href="#projects"
              className="group flex items-center gap-6 px-7 py-4 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl hover:border-primary/60 hover:bg-primary/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,217,255,0.15)] relative overflow-hidden"
              data-magnetic="true"
            >
              {/* Periodic sweep */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(0,217,255,0.08) 50%, transparent 100%)",
                  animation: "button-sweep 5s ease-in-out infinite",
                  willChange: "transform",
                }}
              />
              <div className="text-primary font-mono text-sm font-bold tracking-wider relative z-10 group-hover:rotate-12 transition-transform duration-300">{'</>'}</div>
              <span className="text-white text-sm font-semibold tracking-wide relative z-10">View Projects</span>
              <ArrowRight size={16} className="text-white/60 group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 relative z-10 -rotate-45" />
            </a>

            {/* Let's Connect */}
            <a
              href="#contact"
              className="group flex items-center gap-4 hover:gap-6 transition-all duration-300"
              data-magnetic="true"
            >
              <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all duration-300 group-hover:rotate-45 group-hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]">
                <ArrowRight size={18} />
              </div>
              <span className="text-white/80 text-sm font-medium tracking-wide text-right group-hover:text-white transition-colors">Let&apos;s<br />Connect</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* ═══ SYSTEM METRICS HUD (Item #19) ═══ */}
      <motion.div
        className="absolute bottom-[44px] right-10 z-30 pointer-events-none hidden md:flex flex-col items-end gap-0.5 select-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1, delay: stagger.metrics }}
      >
        {[
          "SYSTEM STATUS: ONLINE",
          "FPS 60",
          "LATENCY 3ms",
          "VERSION 2.0",
        ].map((line, i) => (
          <motion.span
            key={line}
            className="font-mono text-[8px] tracking-[0.2em] text-primary/60 uppercase"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: stagger.metrics + i * 0.1 }}
          >
            {line}
          </motion.span>
        ))}
      </motion.div>

      {/* ═══ SECTION DIVIDER (Item #22) ═══ */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-30 pointer-events-none" />
    </section>
  );
}
