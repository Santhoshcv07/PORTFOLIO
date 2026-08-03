"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const mouseX = useSpring(mousePosition.x, { stiffness: 50, damping: 10 });
  const mouseY = useSpring(mousePosition.y, { stiffness: 50, damping: 10 });
  
  // Parallax for different layers
  const textX = useTransform(mouseX, (x) => x * 0.5);
  const textY = useTransform(mouseY, (y) => y * 0.5);
  const portraitX = useTransform(mouseX, (x) => -x * 1.5);
  const portraitY = useTransform(mouseY, (y) => -y * 1.5);
  const ringX = useTransform(mouseX, (x) => x * 0.2);
  const ringY = useTransform(mouseY, (y) => y * 0.2);

  return (
    <section 
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background Grid & Noise */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_20%,transparent_100%)] z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0 pointer-events-none" />

      {/* Orbit Rings Layer */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        style={{ x: ringX, y: ringY }}
      >
        <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full border-[0.5px] border-primary/20 animate-[spin_40s_linear_infinite]" />
        <div className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full border-[0.5px] border-primary/10 animate-[spin_60s_linear_infinite_reverse]">
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_#00d9ff]" />
        </div>
        <div className="absolute w-[800px] h-[800px] md:w-[1000px] md:h-[1000px] rounded-full border-[0.5px] border-primary/5 animate-[spin_80s_linear_infinite]" />
      </motion.div>

      {/* HUGE Background Text */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-10 flex flex-col items-center justify-center"
        style={{ y: y1, x: textX, opacity }}
      >
        <motion.h1 
          className="font-hero text-[120px] sm:text-[180px] md:text-[220px] lg:text-[280px] leading-none tracking-tighter text-white font-bold opacity-90 drop-shadow-2xl whitespace-nowrap"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          SANTHOSH CV
        </motion.h1>
      </motion.div>

      {/* Center Portrait */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex justify-center items-end"
        style={{ x: portraitX, y: portraitY }}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="relative w-[350px] md:w-[450px] lg:w-[500px] h-[450px] md:h-[600px] lg:h-[700px]"
        >
          {/* Cyan Glow Behind Portrait */}
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full transform -translate-y-10" />
          
          <div className="w-full h-full relative" style={{ maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}>
            <div className="absolute inset-0 bg-[url('/assets/images/portrait_new.png')] bg-cover bg-top bg-no-repeat transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />
          </div>


        </motion.div>
      </motion.div>

      {/* UI Overlay Layers */}
      <div className="absolute inset-0 w-full max-w-[1600px] mx-auto px-5 md:px-10 lg:px-16 flex flex-col md:flex-row justify-between items-end md:items-center z-30 pointer-events-none pt-[80px] pb-0">
        
        {/* LEFT COLUMN */}
        <div className="relative flex flex-col h-full justify-between w-full md:w-1/3 pb-4 md:pb-6 pointer-events-auto items-start">
          
          {/* Top Block: Pills & Heading */}
          <div>
            {/* Top Left: Pills */}
            <motion.div 
              className="flex flex-wrap gap-2 mb-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {["AI ENGINEER", "FULL STACK", "AI AUTOMATION"].map((skill, i) => (
                <div key={skill} className="group flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(0,217,255,0.2)] transition-all duration-300 cursor-default" data-magnetic="true">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:animate-pulse shadow-[0_0_5px_#00d9ff]" />
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">{skill}</span>
                </div>
              ))}
            </motion.div>

            {/* Middle Left: Heading */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <h2 className="font-heading text-base md:text-lg lg:text-xl tracking-[0.15em] text-white/70 mb-1">BUILDING AI</h2>
              <h2 className="font-heading text-xl md:text-2xl lg:text-3xl tracking-[0.15em] font-bold mb-3 uppercase">
                <span className="text-primary drop-shadow-[0_0_10px_rgba(0,217,255,0.3)]">INTELLIGENT</span> <span className="text-white">SOLUTIONS</span>
              </h2>
              <div className="w-10 h-[2px] bg-gradient-to-r from-primary to-transparent my-4" />
            </motion.div>
          </div>

          {/* Vertical Text (Absolute to prevent overflow, made smaller and pushed to the side) */}
          <div className="absolute -left-2 lg:-left-6 top-[40%] -translate-y-1/2 hidden md:flex items-center justify-start pointer-events-none opacity-60">
            <div 
              className="text-[7px] lg:text-[8px] tracking-[0.25em] text-white/50 uppercase font-sans whitespace-nowrap" 
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              NEXT.JS • REACT • TYPESCRIPT • FASTAPI
            </div>
          </div>

          {/* Bottom Left: Profile Info */}
          <motion.div 
            className="mb-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-transparent border-[2px] border-primary flex items-center justify-center p-[2px]">
                <span className="w-full h-full bg-primary rounded-full" />
              </span>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white font-semibold">HELLO, I'M</span>
            </div>
            <h3 className="font-sans text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 tracking-tight">Santhosh CV</h3>
            <p className="text-primary text-xs md:text-sm font-medium mb-4 tracking-wide drop-shadow-[0_0_8px_rgba(0,217,255,0.4)]">AI Engineer & Full Stack Developer</p>
            <p className="text-secondary-foreground text-[10px] md:text-xs leading-relaxed max-w-[260px] md:max-w-[300px] mb-6 font-sans">
              Building intelligent AI applications, scalable software, and modern digital experiences focused on performance and real-world impact.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
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
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:border-primary hover:text-black transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]"
                  data-magnetic="true"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="hidden md:flex flex-col h-full justify-between items-end w-1/3 pb-6 md:pb-8 pointer-events-auto text-right">
          
          {/* Top Right: Available for Work */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center gap-2 justify-end mb-2 group">
              <span className="text-[11px] uppercase tracking-[0.15em] text-white font-medium group-hover:text-primary transition-colors">AVAILABLE FOR WORK</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_#00d9ff]"></span>
              </span>
            </div>
            <p className="text-[9px] tracking-[0.2em] text-white/40 uppercase">LET'S BUILD SOMETHING GREAT</p>
          </motion.div>

          {/* Middle Right: Scroll Indicator */}
          <motion.div 
            className="flex flex-col items-center gap-6 absolute right-6 lg:right-16 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center p-1 relative">
              <div className="absolute inset-0 rounded-full border border-primary/40 animate-[spin_4s_linear_infinite]" style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }} />
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]"
                animate={{ y: [-6, 6, -6] }}
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
            </div>
          </motion.div>

          {/* Bottom Right: Buttons */}
          <motion.div 
            className="flex flex-col items-end gap-6 mb-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <a 
              href="#projects" 
              className="group flex items-center gap-6 px-7 py-4 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl hover:border-primary/60 hover:bg-primary/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,217,255,0.15)] relative overflow-hidden"
              data-magnetic="true"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              <div className="text-primary font-mono text-sm font-bold tracking-wider relative z-10">{'</>'}</div>
              <span className="text-white text-sm font-semibold tracking-wide relative z-10">View Projects</span>
              <ArrowRight size={16} className="text-white/60 group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 relative z-10 -rotate-45" />
            </a>
            
            <a 
              href="#contact"
              className="group flex items-center gap-4 hover:gap-6 transition-all duration-300"
              data-magnetic="true"
            >
              <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all duration-300 group-hover:rotate-45 group-hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]">
                <ArrowRight size={18} />
              </div>
              <span className="text-white/80 text-sm font-medium tracking-wide text-right group-hover:text-white transition-colors">Let's<br/>Connect</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
