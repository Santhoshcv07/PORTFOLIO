"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { 
  SiPython, SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiFastapi,
  SiNodedotjs, SiHtml5, SiCss, SiFirebase, SiUnity, SiGit, 
  SiGithub, SiVercel, SiRender
} from "react-icons/si";
import { TbBrandCSharp, TbBrandOpenai } from "react-icons/tb";
import { Database } from "lucide-react";

// 2D AI Core Component (Optimized)
function CentralCore({ isHovered, clickPulse }: { isHovered: boolean, clickPulse: number }) {
  const [clicked, setClicked] = useState(false);
  const [hoverRipples, setHoverRipples] = useState<{ id: number }[]>([]);

  // Click interaction
  useEffect(() => {
    if (clickPulse > 0) {
      setClicked(true);
      const timer = setTimeout(() => setClicked(false), 300);
      return () => clearTimeout(timer);
    }
  }, [clickPulse]);

  // Hover interaction - emit one immediate ripple
  useEffect(() => {
    if (isHovered) {
      const id = Date.now();
      setHoverRipples(prev => [...prev, { id }]);
      const timer = setTimeout(() => {
        setHoverRipples(prev => prev.filter(r => r.id !== id));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isHovered]);

  return (
    <div 
      className="relative z-20 flex flex-col items-center justify-center rounded-full glass border border-primary/40 bg-surface/40 backdrop-blur-md transition-transform duration-300 ease-out"
      style={{
        width: 140,
        height: 140,
        transform: `scale(${clicked ? 1.05 : 1})`,
      }}
    >
      {/* Periodic Energy Ripple (every 8-10s) */}
      <div 
        className="absolute inset-0 rounded-full border border-primary/40 pointer-events-none blur-[2px]"
        style={{
          animation: 'core-energy-ripple 9s cubic-bezier(0.1, 0.5, 0.3, 1) infinite',
        }}
      />

      {/* Hover-triggered Energy Ripples */}
      <AnimatePresence>
        {hoverRipples.map(r => (
          <motion.div
            key={r.id}
            className="absolute inset-0 rounded-full border border-primary/50 pointer-events-none blur-[2px]"
            initial={{ scale: 1, opacity: 0.35 }}
            animate={{ scale: 3.5, opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Glow layer - breathing effect */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none transition-all duration-700 ease-in-out"
        style={{
          boxShadow: '0 0 70px rgba(0, 217, 255, 0.5), inset 0 0 20px rgba(0, 217, 255, 0.2)',
          opacity: isHovered ? 0.65 : 0.35, /* 15% brighter on hover compared to breathing max (0.5) */
          transform: isHovered ? 'scale(1.15)' : 'scale(1)',
          animation: isHovered ? 'none' : 'core-glow-pulse 5.5s ease-in-out infinite'
        }}
      />

      {/* Floating & Pulsing wrapper */}
      <div 
        className="flex flex-col items-center justify-center w-full h-full pointer-events-none"
        style={{ animation: 'core-float 7s ease-in-out infinite' }}
      >
        <div 
          className="flex flex-col items-center justify-center"
          style={{ animation: 'core-scale-pulse 5.5s ease-in-out infinite' }}
        >
          <span className="font-heading text-4xl font-bold text-white tracking-wider drop-shadow-[0_0_15px_rgba(0,217,255,0.8)] leading-none">SC</span>
          <span className="text-primary text-[9px] font-mono tracking-widest mt-1.5 opacity-90 text-center leading-tight">
            AI<br/>ENGINEER
          </span>
        </div>
      </div>
    </div>
  );
}

const innerNodes = [
  { icon: SiTypescript, name: "TypeScript", category: "Language", color: "#3178C6" },
  { icon: SiJavascript, name: "JavaScript", category: "Language", color: "#F7DF1E" },
  { icon: SiPython, name: "Python", category: "Language", color: "#3776AB" },
  { icon: SiReact, name: "React", category: "Frontend", color: "#61DAFB" },
  { icon: SiNextdotjs, name: "Next.js", category: "Frontend", color: "#FFFFFF" },
  { icon: SiNodedotjs, name: "Node.js", category: "Backend", color: "#339933" },
  { icon: SiFastapi, name: "FastAPI", category: "Backend", color: "#009688" },
  { icon: TbBrandOpenai, name: "OpenAI API", category: "AI", color: "#FFFFFF" },
];

const outerNodes = [
  { icon: SiHtml5, name: "HTML5", category: "Frontend", color: "#E34F26" },
  { icon: SiCss, name: "CSS3", category: "Frontend", color: "#1572B6" },
  { icon: TbBrandCSharp, name: "C#", category: "Language", color: "#68217A" },
  { icon: SiFirebase, name: "Firebase", category: "Database", color: "#FFCA28" },
  { icon: Database, name: "ChromaDB", category: "Database", color: "#FF4B4B" },
  { icon: SiUnity, name: "Unity", category: "Game Dev", color: "#FFFFFF" },
  { icon: SiGit, name: "Git", category: "Tools", color: "#F05032" },
  { icon: SiGithub, name: "GitHub", category: "Tools", color: "#FFFFFF" },
  { icon: SiVercel, name: "Vercel", category: "Tools", color: "#FFFFFF" },
  { icon: SiRender, name: "Render", category: "Tools", color: "#46E3B7" },
];

export default function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [clickPulse, setClickPulse] = useState(0);
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

  const handleNodeClick = (e: React.MouseEvent) => {
    setClickPulse(prev => prev + 1);
    
    // Add ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  };

  // Pre-calculate positions
  const innerRadius = 200;
  const outerRadius = 350;

  const innerNodesWithPositions = useMemo(() => {
    return innerNodes.map((node, index) => {
      const angle = (index / innerNodes.length) * Math.PI * 2;
      return {
        ...node,
        x: Math.cos(angle) * innerRadius,
        y: Math.sin(angle) * innerRadius,
        angle
      };
    });
  }, []);

  const outerNodesWithPositions = useMemo(() => {
    return outerNodes.map((node, index) => {
      const angle = (index / outerNodes.length) * Math.PI * 2;
      return {
        ...node,
        x: Math.cos(angle) * outerRadius,
        y: Math.sin(angle) * outerRadius,
        angle
      };
    });
  }, []);

  return (
    <section id="tech-stack" className="relative py-32 overflow-hidden bg-background">
      <style>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-spin-reverse {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        
        @keyframes orbit-spin-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes orbit-spin-ccw-node {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .orbit-container {
          animation: orbit-spin 35s linear infinite;
        }
        .orbit-node {
          animation: orbit-spin-reverse 35s linear infinite;
        }
        
        .orbit-container-ccw {
          animation: orbit-spin-ccw 45s linear infinite;
        }
        .orbit-node-ccw {
          animation: orbit-spin-ccw-node 45s linear infinite;
        }

        .orbit-paused .orbit-container,
        .orbit-paused .orbit-node,
        .orbit-paused .orbit-container-ccw,
        .orbit-paused .orbit-node-ccw {
          animation-play-state: paused;
        }

        @keyframes core-glow-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }
        @keyframes core-float {
          0%, 100% { transform: translateY(-2px); }
          50% { transform: translateY(2px); }
        }
        @keyframes core-scale-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
        @keyframes core-energy-ripple {
          0% { transform: scale(1); opacity: 0.25; }
          100% { transform: scale(3.5); opacity: 0; }
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 relative z-10" ref={containerRef}>
        
        <div className="flex flex-col items-center text-center mb-24">
          <span className="text-primary font-mono text-sm tracking-widest mb-4 block">02</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white uppercase tracking-wider mb-6">
            TECH <span className="text-primary">STACK</span>
          </h2>
          <p className="text-secondary-foreground text-lg max-w-2xl font-sans">
            A curated set of technologies, frameworks, and tools I use to build scalable, intelligent, and high-performance applications.
          </p>
        </div>

        {/* Core & Floating Nodes Container */}
        <div 
          className={`relative w-full max-w-[900px] mx-auto aspect-square flex items-center justify-center ${isHovered ? 'orbit-paused' : ''}`}
        >
          
          {/* Orbit Responsive Scaler */}
          <div className="absolute flex items-center justify-center w-[900px] h-[900px] scale-[0.4] sm:scale-[0.7] md:scale-[0.85] lg:scale-100 origin-center z-10">
            {/* Orbit Wrapper (centered via Flexbox) */}
            <div className="relative flex items-center justify-center w-full h-full">
            
            {/* Background Glow */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none transition-opacity duration-700" 
              style={{ opacity: isHovered ? 0.8 : 0.4 }}
            />

            {/* Orbit Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border transition-all duration-1000 ease-in-out pointer-events-none" style={{ borderColor: isHovered ? 'rgba(0, 217, 255, 0.35)' : 'rgba(0, 217, 255, 0.15)', boxShadow: isHovered ? '0 0 40px rgba(0, 217, 255, 0.1)' : '0 0 10px rgba(0, 217, 255, 0.02)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border transition-all duration-1000 ease-in-out pointer-events-none" style={{ borderColor: isHovered ? 'rgba(0, 217, 255, 0.25)' : 'rgba(0, 217, 255, 0.08)', boxShadow: isHovered ? '0 0 40px rgba(0, 217, 255, 0.05)' : 'none' }} />

            {/* 2D AI Core */}
            <CentralCore isHovered={isHovered} clickPulse={clickPulse} />

            {/* INNER ORBIT */}
            <div className="absolute top-1/2 left-1/2 w-0 h-0 orbit-container">
              {/* Connection Lines */}
              {innerNodesWithPositions.map((node) => (
                <div 
                  key={`line-${node.name}`}
                  className="absolute top-0 left-0 h-[1px] bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 origin-left transition-opacity duration-500 -z-10"
                  style={{
                    width: innerRadius - 60,
                    opacity: hoveredNode === node.name ? 1 : (isHovered ? 0.35 : 0.15),
                    transform: `rotate(${node.angle}rad) translateX(60px)`,
                  }}
                />
              ))}

              {/* Nodes */}
              {innerNodesWithPositions.map((node) => (
                <div
                  key={node.name}
                  className="absolute flex flex-col items-center justify-center group orbit-node"
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                  }}
                  onMouseEnter={() => { setIsHovered(true); setHoveredNode(node.name); }}
                  onMouseLeave={() => { setIsHovered(false); setHoveredNode(null); }}
                >
                  {/* Node Icon Container */}
                  <button
                    className="relative w-16 h-16 rounded-2xl glass flex flex-col items-center justify-center border border-white/5 
                    group-hover:border-primary transition-all duration-300 
                    group-hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] group-hover:scale-110 
                    group-hover:-translate-y-2 relative z-10 bg-surface/50 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                    onClick={handleNodeClick}
                    aria-label={`Technology: ${node.name}`}
                  >
                    <node.icon size={28} color={node.color} className="opacity-85 group-hover:opacity-100 group-hover:brightness-125 group-hover:scale-110 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(0,217,255,0.8)]" />
                    
                    {/* Ripple effect container */}
                    <AnimatePresence>
                      {ripples.map(r => (
                        <motion.span
                          key={r.id}
                          className="absolute bg-primary/40 rounded-full pointer-events-none"
                          initial={{ top: r.y, left: r.x, width: 0, height: 0, opacity: 1, x: '-50%', y: '-50%' }}
                          animate={{ width: 150, height: 150, opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      ))}
                    </AnimatePresence>
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute top-[calc(100%+16px)] opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 pointer-events-none flex flex-col items-center transform translate-y-2 group-hover:translate-y-0 group-focus:translate-y-0 z-50">
                    <div className="glass px-4 py-2 rounded-xl border border-primary/50 shadow-[0_4px_20px_rgba(0,217,255,0.2)] flex items-center gap-2 backdrop-blur-md bg-surface/80">
                       <node.icon size={14} color={node.color} />
                       <span className="text-white text-sm font-medium whitespace-nowrap">{node.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* OUTER ORBIT */}
            <div className="absolute top-1/2 left-1/2 w-0 h-0 orbit-container-ccw">
              {/* Connection Lines */}
              {outerNodesWithPositions.map((node) => (
                <div 
                  key={`line-${node.name}`}
                  className="absolute top-0 left-0 h-[1px] bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 origin-left transition-opacity duration-500 -z-10"
                  style={{
                    width: outerRadius - 60,
                    opacity: hoveredNode === node.name ? 1 : (isHovered ? 0.35 : 0.15),
                    transform: `rotate(${node.angle}rad) translateX(60px)`,
                  }}
                />
              ))}

              {/* Nodes */}
              {outerNodesWithPositions.map((node) => (
                <div
                  key={node.name}
                  className="absolute flex flex-col items-center justify-center group orbit-node-ccw"
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                  }}
                  onMouseEnter={() => { setIsHovered(true); setHoveredNode(node.name); }}
                  onMouseLeave={() => { setIsHovered(false); setHoveredNode(null); }}
                >
                  {/* Node Icon Container */}
                  <button
                    className="relative w-16 h-16 rounded-2xl glass flex flex-col items-center justify-center border border-white/5 
                    group-hover:border-primary transition-all duration-300 
                    group-hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] group-hover:scale-110 
                    group-hover:-translate-y-2 relative z-10 bg-surface/50 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                    onClick={handleNodeClick}
                    aria-label={`Technology: ${node.name}`}
                  >
                    <node.icon size={28} color={node.color} className="opacity-85 group-hover:opacity-100 group-hover:brightness-125 group-hover:scale-110 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(0,217,255,0.8)]" />
                    
                    {/* Ripple effect container */}
                    <AnimatePresence>
                      {ripples.map(r => (
                        <motion.span
                          key={r.id}
                          className="absolute bg-primary/40 rounded-full pointer-events-none"
                          initial={{ top: r.y, left: r.x, width: 0, height: 0, opacity: 1, x: '-50%', y: '-50%' }}
                          animate={{ width: 150, height: 150, opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      ))}
                    </AnimatePresence>
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute top-[calc(100%+16px)] opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 pointer-events-none flex flex-col items-center transform translate-y-2 group-hover:translate-y-0 group-focus:translate-y-0 z-50">
                    <div className="glass px-4 py-2 rounded-xl border border-primary/50 shadow-[0_4px_20px_rgba(0,217,255,0.2)] flex items-center gap-2 backdrop-blur-md bg-surface/80">
                       <node.icon size={14} color={node.color} />
                       <span className="text-white text-sm font-medium whitespace-nowrap">{node.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
