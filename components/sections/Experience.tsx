"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { m as motion, useScroll, useTransform, useInView, Variants, useSpring, useMotionValue } from "framer-motion";
import { GraduationCap, Code2, BrainCircuit, Rocket, Trophy } from "lucide-react";

const journeySteps = [
  {
    year: "2022",
    title: "Learn",
    icon: GraduationCap,
    description: "Started my journey with curiosity, learning programming fundamentals, and building a strong foundation in computer science.",
    keywords: ["fundamentals", "computer science"],
    highlight: false,
  },
  {
    year: "2023",
    title: "Build",
    icon: Code2,
    description: "Built full-stack applications, explored different technologies, and transformed ideas into real software projects.",
    keywords: ["full-stack applications", "technologies", "software"],
    highlight: false,
  },
  {
    year: "2024",
    title: "AI Focus",
    icon: BrainCircuit,
    description: "Focused on Artificial Intelligence, LLMs, automation, AI agents, and building intelligent real-world solutions.",
    keywords: ["Artificial Intelligence", "LLMs", "automation", "AI agents"],
    highlight: true,
  },
  {
    year: "2025",
    title: "Impact",
    icon: Rocket,
    description: "Creating scalable AI products and software that solve real-world problems and deliver meaningful impact.",
    keywords: ["scalable", "AI products", "impact"],
    highlight: false,
  },
  {
    year: "2026+",
    title: "Future",
    icon: Trophy,
    description: "Continuously learning, building, and pushing the limits of AI engineering while creating innovative products for the future.",
    keywords: ["AI engineering", "innovative products"],
    highlight: false,
  }
];

// Reusable function to render descriptions with highlighted keywords
function HighlightedText({ text, keywords }: { text: string, keywords: string[] }) {
  if (!keywords || keywords.length === 0) return <>{text}</>;

  const regex = new RegExp(`(${keywords.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        keywords.some(k => k.toLowerCase() === part.toLowerCase()) ? (
          <span key={i} className="relative inline-block group/keyword cursor-default text-white">
            {part}
            <span className="absolute left-0 bottom-[-2px] w-full h-[1px] bg-primary/40 scale-x-0 group-hover/keyword:scale-x-100 transition-transform duration-300 origin-left" />
            <span className="absolute left-0 bottom-[-2px] w-full h-[1px] bg-primary scale-x-0 group-hover/keyword:scale-x-100 transition-transform duration-500 delay-75 origin-left" />
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function JourneyCard({ 
  step, 
  index, 
  isEven, 
  scrollProgress 
}: {
  step: typeof journeySteps[0],
  index: number,
  isEven: boolean,
  scrollProgress: any
}) {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  
  // Custom Parallax Depth based on global scroll
  // Cards move slightly slower than the background
  const yParallax = useTransform(scrollProgress, [0, 1], [30, -30]);

  // Entrance tracking
  const isCenter = useInView(cardContainerRef, { margin: "-40% 0px -40% 0px" });
  const isVisible = useInView(cardContainerRef, { margin: "200px 0px 200px 0px" });
  const [hasUnlocked, setHasUnlocked] = useState(false);

  useEffect(() => {
    if (isCenter && !hasUnlocked) {
      setHasUnlocked(true);
    }
  }, [isCenter, hasUnlocked]);

  // Spotlight logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  // Unlock sequence choreography
  const cardVariants: Variants = {
    locked: {
      y: 30,
      opacity: 0,
      scale: 0.98,
      filter: "blur(4px)"
    },
    unlocked: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
        delay: 0.2 // Wait for node to pulse
      }
    }
  };

  const nodeVariants: Variants = {
    locked: { scale: 0, opacity: 0 },
    unlocked: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  return (
    <div 
      id={`journey-step-${index}`} 
      ref={cardContainerRef} 
      className="relative flex flex-col md:flex-row items-center justify-between w-full group perspective-[1000px]"
    >
      {/* ─── Timeline Node (Center) ─── */}
      <motion.div 
        className="absolute left-[24px] md:left-1/2 -translate-x-1/2 z-30 cursor-pointer"
        variants={nodeVariants}
        initial="locked"
        animate={hasUnlocked ? "unlocked" : "locked"}
        onClick={() => {
          document.getElementById(`journey-step-${index}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      >
        <div className="relative w-5 h-5 rounded-full flex items-center justify-center group/node">
          {/* Metal rim */}
          <div className="absolute inset-0 rounded-full border-[2px] border-white/20 bg-[#111] group-hover/node:border-primary/50 transition-colors duration-300" />
          
          {/* Cyan Energy Core */}
          <div className={`w-2 h-2 rounded-full transition-all duration-700 ${
            hasUnlocked 
              ? 'bg-primary shadow-[0_0_15px_rgba(0,217,255,1)]' 
              : 'bg-primary/20'
          }`} />

          {/* Unlock Pulse Flash */}
          {hasUnlocked && (
            <motion.div 
              className="absolute inset-0 rounded-full border border-primary pointer-events-none"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}

          {/* Ripple on hover */}
          <div className="absolute inset-0 rounded-full border border-primary/0 group-hover/node:border-primary/50 group-hover/node:animate-ping opacity-0 group-hover/node:opacity-100 transition-opacity duration-300" />
        </div>
      </motion.div>

      {/* Floating Particles leaving active node */}
      {(hasUnlocked && isVisible) && (
        <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 top-0 pointer-events-none z-20">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/40 shadow-[0_0_5px_rgba(0,217,255,0.5)]"
              initial={{ y: 0, x: 0, opacity: 1 }}
              animate={{ 
                y: -50 - Math.random() * 50, 
                x: (Math.random() - 0.5) * 30,
                opacity: 0 
              }}
              transition={{ 
                duration: 2 + Math.random() * 2, 
                repeat: Infinity,
                delay: i * 0.8
              }}
            />
          ))}
        </div>
      )}

      {/* ─── Empty Spacer ─── */}
      <div className={`hidden md:block w-[45%] ${isEven ? 'order-1' : 'order-2'}`} />

      {/* ─── Acrylic Card ─── */}
      <motion.div 
        className={`w-full md:w-[45%] pl-14 md:pl-0 ${isEven ? 'order-2 md:text-left' : 'order-1 md:text-right'} relative`}
        variants={cardVariants}
        initial="locked"
        animate={hasUnlocked ? "unlocked" : "locked"}
        style={{ y: yParallax, willChange: "transform, opacity" }}
        onMouseMove={handleMouseMove}
      >
        <div className={`relative p-6 md:p-8 rounded-[20px] md:rounded-[24px] bg-[#111]/40 backdrop-blur-xl border transition-all duration-700 ease-out flex flex-col overflow-hidden ${
          isEven ? 'items-start text-left' : 'items-start md:items-end text-left md:text-right'
        } ${
          hasUnlocked 
            ? 'border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_40px_rgba(0,0,0,0.5)] hover:border-primary/30 hover:-translate-y-1 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(0,217,255,0.05)] hover:bg-[#151515]/60' 
            : 'border-white/5 opacity-50'
        }`}>
          
          {/* 3% Mouse Spotlight (Only visible when unlocked & hovered) */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-0 mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-500 will-change-transform hidden md:block"
            style={{
              background: "radial-gradient(circle, rgba(0,217,255,0.03) 0%, transparent 50%)",
              x: springX,
              y: springY,
              translateX: "-50%",
              translateY: "-50%",
            }}
          />

          {/* Background Ambient Glow for Active Card */}
          {hasUnlocked && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          )}

          <div className="relative z-10 w-full">
            {/* Numbering & Year */}
            <div className={`flex items-center gap-3 mb-4 md:mb-6 font-mono text-[10px] uppercase tracking-[0.2em] ${isEven ? 'justify-start' : 'justify-start md:justify-end'}`}>
              <span className="text-white/20 font-bold">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="w-4 h-px bg-white/10" />
              <span className="text-primary/60 font-medium">
                {step.year}
              </span>
            </div>

            {/* Icon Container with Rotating Ring */}
            <div className={`relative w-[50px] h-[50px] md:w-[60px] md:h-[60px] flex items-center justify-center mb-5 md:mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1 ${isEven ? 'mx-0' : 'mx-0 md:ml-auto'}`}>
              
              {/* Floating slow breathe */}
              <div className={`absolute inset-0 bg-primary/5 rounded-full blur-md ${isVisible ? 'animate-[ambient-breathe_4s_ease-in-out_infinite]' : ''}`} />
              
              {/* Rotating Segmented Ring */}
              <svg className={`absolute inset-0 w-full h-full text-primary/30 ${isVisible ? 'animate-[spin_10s_linear_infinite]' : ''}`} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5 30 5" opacity="0.5" />
              </svg>
              <svg className={`absolute inset-0 w-full h-full text-primary/10 ${isVisible ? 'animate-[spin_15s_linear_infinite_reverse]' : ''}`} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="20 10" opacity="0.5" />
              </svg>

              <step.icon 
                size={24} 
                className="text-primary drop-shadow-[0_0_8px_rgba(0,217,255,0.4)] transition-all duration-300 relative z-10 w-5 h-5 md:w-6 md:h-6" 
                strokeWidth={1.5}
              />
            </div>

            {/* Title */}
            <h3 className="font-heading text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white tracking-wide">
              {step.title}
            </h3>
            
            {/* Description with Animated Keywords */}
            <p className="text-sm md:text-[15px] leading-relaxed font-sans text-secondary-foreground">
              <HighlightedText text={step.description} keywords={step.keywords} />
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll for the "Energy Pipeline"
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // Check if user has reached the end of the timeline
  const [journeyComplete, setJourneyComplete] = useState(false);
  
  useTransform(scrollYProgress, (val) => {
    if (val >= 0.98 && !journeyComplete) {
      setJourneyComplete(true);
    } else if (val < 0.95 && journeyComplete) {
      setJourneyComplete(false);
    }
    return val;
  });

  return (
    <section id="experience" className="relative py-32 md:py-48 overflow-hidden bg-background" ref={containerRef}>
      
      {/* ─── Background Story Layer ─── */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
        {/* Subtle Grid */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Technical Dots & Blueprint Lines */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-32 md:mb-48">
          <span className="text-primary/60 font-mono text-xs tracking-[0.3em] mb-5 block">03</span>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider mb-6">
            MY <span className="text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(0,217,255,0.3)]" style={{ backgroundImage: "linear-gradient(135deg, #00D9FF 0%, #62EFFF 50%, #00D9FF 100%)" }}>JOURNEY</span>
          </h2>
          <p className="text-secondary-foreground text-base md:text-lg max-w-2xl font-sans leading-relaxed">
            A continuous path of learning, building, and pushing the boundaries of what is possible with AI and software engineering.
          </p>
        </div>

        <div className="relative">
          {/* ─── Jarvis Energy Pipeline (Vertical Line) ─── */}
          
          {/* Base Track */}
          <div className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/10" />
          
          {/* Fill Bar */}
          <motion.div 
            className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 top-0 w-[2px] bg-primary origin-top shadow-[0_0_15px_rgba(0,217,255,0.6)] z-10"
            style={{ height: lineHeight }}
          />

          {/* Pipeline Data Pulses (Small packets traveling down) */}
          <div className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[1px] z-20 overflow-hidden pointer-events-none">
            <div className="w-full h-[40px] bg-gradient-to-b from-transparent via-white to-transparent animate-[button-sweep_3s_linear_infinite]" />
            <div className="w-full h-[60px] bg-gradient-to-b from-transparent via-primary to-transparent animate-[button-sweep_5s_linear_infinite_0.5s]" />
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-16 md:gap-32 relative z-30 pb-32">
            {journeySteps.map((step, index) => (
              <JourneyCard 
                key={index}
                step={step}
                index={index}
                isEven={index % 2 === 0}
                scrollProgress={scrollYProgress}
              />
            ))}
          </div>

          {/* ─── Journey Completion Finale ─── */}
          <div className="absolute bottom-0 left-[24px] md:left-1/2 md:-translate-x-1/2 translate-y-full flex flex-col items-center pt-8 z-30">
            <motion.div 
              className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${
                journeyComplete ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(0,217,255,0.5)]' : 'border-white/20 bg-background'
              }`}
            >
              <div className={`w-1 h-1 rounded-full bg-primary transition-opacity duration-700 ${journeyComplete ? 'opacity-100 animate-ping' : 'opacity-0'}`} />
            </motion.div>
            
            <motion.span 
              className={`mt-4 font-mono text-[10px] uppercase tracking-[0.3em] transition-all duration-700 ${
                journeyComplete ? 'text-primary opacity-100 drop-shadow-[0_0_10px_rgba(0,217,255,0.4)]' : 'text-white/20 opacity-0'
              }`}
            >
              The Journey Continues...
            </motion.span>
          </div>

        </div>
      </div>
    </section>
  );
}
