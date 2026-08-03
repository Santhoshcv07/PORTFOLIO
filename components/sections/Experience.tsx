"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, Variants } from "framer-motion";
import { GraduationCap, Code2, BrainCircuit, Rocket, Trophy } from "lucide-react";

const journeySteps = [
  {
    title: "Learn",
    icon: GraduationCap,
    description: "Started my journey with curiosity, learning programming fundamentals, and building a strong foundation in computer science.",
    highlight: false,
  },
  {
    title: "Build",
    icon: Code2,
    description: "Built full-stack applications, explored different technologies, and transformed ideas into real software projects.",
    highlight: false,
  },
  {
    title: "AI Focus",
    icon: BrainCircuit,
    description: "Focused on Artificial Intelligence, LLMs, automation, AI agents, and building intelligent real-world solutions.",
    highlight: true,
  },
  {
    title: "Impact",
    icon: Rocket,
    description: "Creating scalable AI products and software that solve real-world problems and deliver meaningful impact.",
    highlight: false,
  },
  {
    title: "Future",
    icon: Trophy,
    description: "Continuously learning, building, and pushing the limits of AI engineering while creating innovative products for the future.",
    highlight: false,
  }
];

function JourneyCard({ 
  step, 
  index, 
  isEven, 
  activeIndex, 
  setActiveIndex, 
  setEndEffectTrigger,
  endEffect
}: {
  step: typeof journeySteps[0],
  index: number,
  isEven: boolean,
  activeIndex: number,
  setActiveIndex: (idx: number) => void,
  setEndEffectTrigger: (val: boolean) => void,
  endEffect: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { margin: "-45% 0px -45% 0px" });
  const isActive = activeIndex === index;

  useEffect(() => {
    if (isInView) {
      setActiveIndex(index);
    }
  }, [isInView, index, setActiveIndex]);

  const cardVariants: Variants = {
    active: {
      scale: 1.18,
      x: [0, -2, 2, -1, 1, 0],
      y: [0, 1, -1, 1, 0],
      rotateZ: [0, 0.3, -0.3, 0.15, 0],
      opacity: 1,
      transition: {
        scale: { type: "spring", stiffness: 220, damping: 15 },
        x: { duration: 0.25, delay: 0.05 },
        y: { duration: 0.25, delay: 0.05 },
        rotateZ: { duration: 0.25, delay: 0.05 },
        opacity: { duration: 0.3 }
      }
    },
    inactive: {
      scale: 1,
      x: 0,
      y: 0,
      rotateZ: 0,
      opacity: 0.5,
      transition: {
        type: "spring", stiffness: 180, damping: 20
      }
    }
  };

  const handleAnimationComplete = (definition: string) => {
    if (definition === "active" && index === journeySteps.length - 1) {
      setEndEffectTrigger(true);
    }
  };

  const nodeGlow = isActive || endEffect;

  return (
    <div ref={cardRef} className="relative flex flex-col md:flex-row items-center justify-between w-full group">
      
      {/* Timeline Node */}
      <motion.div 
        className={`absolute left-[24px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300 z-20 ${
          nodeGlow
            ? 'border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,1)] bg-[#00E5FF] scale-125' 
            : 'bg-background border-primary/70 shadow-[0_0_10px_rgba(0,217,255,0.3)]'
        }`}
        animate={isActive ? { scale: 1.25 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      />

      {/* Empty space for alternating layout */}
      <div className={`hidden md:block w-[45%] ${isEven ? 'order-1' : 'order-2'}`} />

      {/* Content Card Wrapper */}
      <motion.div 
        className={`w-full md:w-[45%] pl-16 md:pl-0 ${isEven ? 'order-2 md:text-left' : 'order-1 md:text-right'} relative`}
        variants={cardVariants}
        initial="inactive"
        animate={isActive ? "active" : "inactive"}
        onAnimationComplete={handleAnimationComplete}
      >
        
        {/* Volumetric Energy Mist Effect (Rendered behind the card) */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Top Mist */}
            <motion.div 
              className="absolute left-[10%] right-[10%] top-[-20px] h-[60px] rounded-full blur-[25px]"
              style={{ background: 'radial-gradient(ellipse at center, rgba(0, 229, 255, 0.4) 0%, transparent 70%)' }}
              initial={{ opacity: 0, y: 10, scaleY: 0.5, scaleX: 0.8 }}
              animate={{ opacity: [0, 1, 0], y: -25, scaleY: 1.5, scaleX: 1.1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.05 }}
            />
            {/* Bottom Mist */}
            <motion.div 
              className="absolute left-[10%] right-[10%] bottom-[-20px] h-[60px] rounded-full blur-[25px]"
              style={{ background: 'radial-gradient(ellipse at center, rgba(0, 229, 255, 0.4) 0%, transparent 70%)' }}
              initial={{ opacity: 0, y: -10, scaleY: 0.5, scaleX: 0.8 }}
              animate={{ opacity: [0, 1, 0], y: 25, scaleY: 1.5, scaleX: 1.1 }}
              transition={{ duration: 1.1, ease: "easeOut", delay: 0.1 }}
            />
            {/* Left Mist */}
            <motion.div 
              className="absolute top-[10%] bottom-[10%] left-[-20px] w-[60px] rounded-full blur-[25px]"
              style={{ background: 'radial-gradient(ellipse at center, rgba(0, 229, 255, 0.4) 0%, transparent 70%)' }}
              initial={{ opacity: 0, x: 10, scaleX: 0.5, scaleY: 0.8 }}
              animate={{ opacity: [0, 1, 0], x: -25, scaleX: 1.5, scaleY: 1.1 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            />
            {/* Right Mist */}
            <motion.div 
              className="absolute top-[10%] bottom-[10%] right-[-20px] w-[60px] rounded-full blur-[25px]"
              style={{ background: 'radial-gradient(ellipse at center, rgba(0, 229, 255, 0.4) 0%, transparent 70%)' }}
              initial={{ opacity: 0, x: -10, scaleX: 0.5, scaleY: 0.8 }}
              animate={{ opacity: [0, 1, 0], x: 25, scaleX: 1.5, scaleY: 1.1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.05 }}
            />
          </div>
        )}

        <div className={`glass p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden flex flex-col ${isEven ? 'items-start text-left' : 'items-start md:items-end text-left md:text-right'} ${
          isActive 
            ? 'border-[#00E5FF]/60 shadow-[0_0_50px_rgba(0,229,255,0.25)] bg-surface/80' 
            : 'border-white/5 bg-surface/40'
        }`}>
          
          {/* Inner glow on active */}
          <div className={`absolute inset-0 bg-gradient-to-br from-[#00E5FF]/20 to-transparent transition-opacity duration-500 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Edge Glow Pulse */}
          {isActive && (
            <motion.div 
              className="absolute inset-0 rounded-3xl border border-[#00E5FF] shadow-[0_0_40px_#00E5FF] pointer-events-none z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
          
          {/* Glass Light Sweep */}
          {isActive && (
            <motion.div
              className="absolute top-0 bottom-0 w-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none"
              style={{ transform: "skewX(-20deg)" }}
              initial={{ left: "-150%" }}
              animate={{ left: "150%" }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
            />
          )}
          
          {/* Icon Container */}
          <div className={`w-[68px] h-[68px] rounded-full flex items-center justify-center mb-6 border backdrop-blur-md transition-all duration-500 ease-out relative z-10 ${
            isActive 
              ? 'bg-[#00E5FF]/10 border-[#00E5FF]/40 shadow-[0_0_30px_rgba(0,229,255,0.4)] scale-110' 
              : 'bg-[#00E5FF]/[0.06] border-[#00E5FF]/[0.12] shadow-[0_0_15px_rgba(0,229,255,0.1)]'
          }`}>
            <step.icon 
              size={32} 
              className={`text-[#00E5FF] transition-opacity duration-300 ${isActive ? 'opacity-100 drop-shadow-[0_0_15px_rgba(0,229,255,0.8)]' : 'opacity-80 drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]'}`} 
              strokeWidth={1.5}
            />
          </div>

          {/* Title */}
          <h3 className={`font-heading text-3xl font-bold mb-3 transition-colors duration-500 relative z-10 ${isActive ? 'text-[#00E5FF] drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]' : 'text-white'}`}>
            {step.title}
          </h3>
          
          {/* Description */}
          <p className={`text-base md:text-lg leading-relaxed font-sans transition-colors duration-500 relative z-10 ${isActive ? 'text-white' : 'text-secondary-foreground'}`}>
            {step.description}
          </p>

        </div>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [endEffectTrigger, setEndEffectTrigger] = useState(false);
  const [endEffect, setEndEffect] = useState(false);
  const [timelinePulse, setTimelinePulse] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Global timeline cyan pulse when any card activates
  useEffect(() => {
    if (activeIndex !== -1) {
      setTimelinePulse(true);
      const t = setTimeout(() => setTimelinePulse(false), 400);
      return () => clearTimeout(t);
    }
  }, [activeIndex]);

  // Grand finale effect
  useEffect(() => {
    if (endEffectTrigger) {
      setEndEffect(true);
      const t = setTimeout(() => {
        setEndEffect(false);
        setEndEffectTrigger(false);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [endEffectTrigger]);

  return (
    <section id="experience" className="relative py-32 overflow-hidden bg-background" ref={containerRef}>
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-[1000px] mx-auto px-5 md:px-10 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-24">
          <span className="text-primary font-mono text-sm tracking-widest mb-4 block">03</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white uppercase tracking-wider mb-6">
            MY <span className="text-primary">JOURNEY</span>
          </h2>
          <p className="text-secondary-foreground text-lg max-w-2xl font-sans">
            A continuous path of learning, building, and pushing the boundaries of what is possible with AI and software engineering.
          </p>
        </div>

        <div className="relative">
          {/* Static Center Line with Pulse Effect */}
          <div className={`absolute left-[24px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] transition-all duration-300 ${timelinePulse ? 'bg-[#00E5FF] shadow-[0_0_20px_#00E5FF]' : 'bg-white/5'}`} />
          
          {/* Animated Glowing Line (Scroll Progress) */}
          <motion.div 
            className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 top-0 w-[2px] bg-gradient-to-b from-primary via-primary to-transparent origin-top z-0 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]"
            style={{ height: lineHeight }}
          />

          {/* Cinematic End Effect Beam */}
          {endEffect && (
            <motion.div 
              className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 w-[2px] bg-[#00E5FF] shadow-[0_0_20px_#00E5FF] z-10"
              initial={{ top: "100%", bottom: "0%" }}
              animate={{ top: ["100%", "0%", "0%"], bottom: ["0%", "0%", "100%"] }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          )}

          <div className="flex flex-col gap-16 md:gap-24 relative z-10">
            {journeySteps.map((step, index) => (
              <JourneyCard 
                key={index}
                step={step}
                index={index}
                isEven={index % 2 === 0}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                setEndEffectTrigger={setEndEffectTrigger}
                endEffect={endEffect}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
