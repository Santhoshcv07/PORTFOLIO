"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { m as motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════ */

const AI_LOGS = [
  "[OK] Loading Home",
  "[OK] Initializing AI Engine",
  "[OK] Fetching Projects",
  "[OK] Building Experience",
  "[OK] Optimizing Assets",
  "[OK] Loading Certificates",
  "[OK] Contact System Online",
  "[OK] Complete",
];

const BRAND_STATEMENTS = [
  "Building Intelligent Systems",
  "AI Engineer",
  "Problem Solver",
  "Machine Learning",
  "AI Engineer",
];

const MODULES = ["Home", "Projects", "Experience", "Certificates", "Skills", "Contact"];

/* ═══════════════════════════════════════════════════
   NEURAL NETWORK CANVAS (Level 1)
   GPU-accelerated canvas rendering for 60fps
   ═══════════════════════════════════════════════════ */
function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);
  const packetsRef = useRef<{ x: number; y: number; tx: number; ty: number; progress: number; speed: number }[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize nodes
    const nodeCount = 40;
    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    // Initialize data packets
    packetsRef.current = [];

    const spawnPacket = () => {
      const nodes = nodesRef.current;
      if (nodes.length < 2) return;
      const a = Math.floor(Math.random() * nodes.length);
      let b = Math.floor(Math.random() * nodes.length);
      while (b === a) b = Math.floor(Math.random() * nodes.length);
      packetsRef.current.push({
        x: nodes[a].x,
        y: nodes[a].y,
        tx: nodes[b].x,
        ty: nodes[b].y,
        progress: 0,
        speed: 0.005 + Math.random() * 0.01,
      });
    };

    let packetTimer = 0;

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodes = nodesRef.current;
      const connectionDist = 180;

      // Update node positions
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.08;
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 229, 255, 0.15)";
        ctx.fill();
      }

      // Spawn data packets periodically
      packetTimer++;
      if (packetTimer % 60 === 0) spawnPacket();

      // Update & draw packets
      for (let i = packetsRef.current.length - 1; i >= 0; i--) {
        const p = packetsRef.current[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          packetsRef.current.splice(i, 1);
          continue;
        }
        const cx = p.x + (p.tx - p.x) * p.progress;
        const cy = p.y + (p.ty - p.y) * p.progress;
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${0.6 * (1 - p.progress)})`;
        ctx.shadowColor = "#00E5FF";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

/* ═══════════════════════════════════════════════════
   MOUSE GLOW (Level 8)
   ═══════════════════════════════════════════════════ */
function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`;
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-[60]"
      style={{
        width: 200,
        height: 200,
        background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)",
        borderRadius: "50%",
        willChange: "transform",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════
   TYPING TEXT (Level 3)
   ═══════════════════════════════════════════════════ */
function TypingText({ text, speed = 40, className, style }: { text: string; speed?: number; className?: string; style?: React.CSSProperties }) {
  const [display, setDisplay] = useState("");
  const prevTextRef = useRef("");

  useEffect(() => {
    if (text === prevTextRef.current) return;
    prevTextRef.current = text;
    setDisplay("");
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className} style={style}>
      {display}
      <span className="animate-pulse" style={{ color: "#00E5FF" }}>▎</span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN LOADER
   ═══════════════════════════════════════════════════ */
export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [bootStep, setBootStep] = useState(0);
  const [completedModules, setCompletedModules] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState(0);
  const [brandIndex, setBrandIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [logoPhase, setLogoPhase] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [binaryFlash, setBinaryFlash] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Mount guard for hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Logo build sequence: S → SC → glow → idle
  useEffect(() => {
    const timers = [
      setTimeout(() => setLogoPhase(1), 500),
      setTimeout(() => setLogoPhase(2), 1100),
      setTimeout(() => setLogoPhase(3), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Brand statement rotator (Level 13)
  useEffect(() => {
    const timer = setInterval(() => {
      setBrandIndex((p) => (p + 1) % BRAND_STATEMENTS.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  // Periodic scanner (Level 7)
  useEffect(() => {
    const timer = setInterval(() => {
      setScannerActive(true);
      setTimeout(() => setScannerActive(false), 1500);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Periodic binary flash (Level 7)
  useEffect(() => {
    const timer = setInterval(() => {
      setBinaryFlash(true);
      setTimeout(() => setBinaryFlash(false), 1200);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Main progress engine
  useEffect(() => {
    const totalDuration = 4500;
    const interval = 30;
    const totalSteps = totalDuration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const pct = Math.min(100, Math.floor((currentStep / totalSteps) * 100));
      setProgress(pct);

      // Boot step
      const stepIndex = Math.min(AI_LOGS.length - 1, Math.floor((pct / 100) * AI_LOGS.length));
      setBootStep(stepIndex);

      // Module completions
      const modulesDone = Math.min(MODULES.length, Math.floor((pct / 100) * (MODULES.length + 1)));
      setCompletedModules(modulesDone);

      // AI Logs (Level 4)
      const logsDone = Math.min(AI_LOGS.length, Math.floor((pct / 100) * (AI_LOGS.length + 0.5)));
      setVisibleLogs(logsDone);

      // Easter egg at 99% (Level 12)
      if (pct >= 99 && !easterEgg) {
        setEasterEgg(true);
        setTimeout(() => {
          setShowWelcome(true);
          setTimeout(() => setShowWelcome(false), 500);
        }, 300);
      }

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        // Level 10: Cinematic exit
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => onCompleteRef.current(), 900);
          }, 800);
        }, 600);
      }
    }, interval);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get time-based greeting (Level 11)
  const getGreeting = () => {
    if (!mounted) return "Good day";
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#040404" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(16px)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Mouse Glow (Level 8) */}
          {mounted && <MouseGlow />}

          {/* Neural Network Canvas (Level 1) */}
          {mounted && <NeuralNetwork />}

          {/* Faint grid (Level 1) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,229,255,0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,229,255,0.2) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />

          {/* Rotating radial gradient (Level 1) */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: 600,
              height: 600,
              background: "conic-gradient(from 0deg, rgba(0,229,255,0.04), rgba(79,70,229,0.03), rgba(56,189,248,0.04), transparent)",
              borderRadius: "50%",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Scanner Line (Level 7) */}
          <AnimatePresence>
            {scannerActive && (
              <motion.div
                className="absolute left-0 right-0 h-[1px] pointer-events-none z-20"
                style={{
                  background: "linear-gradient(90deg, transparent 5%, rgba(0,229,255,0.2) 30%, rgba(0,229,255,0.4) 50%, rgba(0,229,255,0.2) 70%, transparent 95%)",
                  boxShadow: "0 0 8px rgba(0,229,255,0.3)",
                }}
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "linear" }}
              />
            )}
          </AnimatePresence>

          {/* Binary Flash (Level 7) */}
          <AnimatePresence>
            {binaryFlash && mounted && (
              <motion.div
                className="absolute font-mono text-[10px] pointer-events-none select-none z-10"
                style={{
                  color: "rgba(0,229,255,0.08)",
                  top: `${30 + Math.random() * 40}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                01010100101010011010
              </motion.div>
            )}
          </AnimatePresence>

          {/* Noise Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay"
            style={{ backgroundImage: "url('/assets/images/noise.png')", backgroundSize: "200px" }}
          />

          {/* ═══ GLASS CARD (Level 14) ═══ */}
          <motion.div
            className="relative z-10 flex flex-col items-center w-full max-w-lg mx-4"
            animate={isExiting ? { scale: 0.95, opacity: 0, filter: "blur(8px)" } : { scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="w-full rounded-[28px] p-8 md:p-10 flex flex-col items-center gap-6 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 0 60px rgba(0,229,255,0.04), 0 4px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Inner noise texture for glass */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: "url('/assets/images/noise.png')", backgroundSize: "150px" }}
              />

              {/* ─── SC LOGO (Level 2) ─── */}
              <div className="relative flex flex-col items-center gap-2 mb-2">
                {/* Glow pulse */}
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 140,
                    height: 140,
                    background: "radial-gradient(circle, rgba(0,229,255,0.2) 0%, transparent 70%)",
                  }}
                  animate={
                    logoPhase >= 2
                      ? { scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }
                      : { scale: 1, opacity: 0 }
                  }
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* SC Text */}
                <div className="relative z-10 overflow-hidden">
                  <motion.span
                    className="text-7xl md:text-8xl font-bold text-white tracking-[0.2em] block"
                    style={{ fontFamily: "var(--font-heading)" }}
                    initial={{ opacity: 0, scale: 0.7, filter: "blur(12px)" }}
                    animate={{
                      opacity: 1,
                      scale: logoPhase >= 3 ? [1, 1.015, 1] : 1,
                      filter: "blur(0px)",
                    }}
                    transition={{
                      opacity: { duration: 0.6 },
                      scale: logoPhase >= 3 ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 },
                      filter: { duration: 0.8 },
                    }}
                  >
                    <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                      S
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, x: -15, filter: "blur(8px)" }}
                      animate={{
                        opacity: logoPhase >= 1 ? 1 : 0,
                        x: logoPhase >= 1 ? 0 : -15,
                        filter: logoPhase >= 1 ? "blur(0px)" : "blur(8px)",
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      C
                    </motion.span>
                  </motion.span>

                  {/* Light sweep across SC (Level 2) */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                    }}
                    initial={{ x: "-100%" }}
                    animate={logoPhase >= 2 ? { x: ["−100%", "200%"] } : {}}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                  />
                </div>

                {/* Name */}
                <motion.div
                  className="text-white text-sm tracking-[0.35em] uppercase font-medium"
                  style={{ fontFamily: "var(--font-sans)" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: logoPhase >= 2 ? 1 : 0, y: logoPhase >= 2 ? 0 : 8 }}
                  transition={{ duration: 0.5 }}
                >
                  SANTHOSH CV
                </motion.div>

                {/* Brand Statement Rotator (Level 13) */}
                <div className="h-5 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={brandIndex}
                      className="text-xs tracking-[0.4em] uppercase"
                      style={{ color: "#00E5FF", fontFamily: "var(--font-mono, monospace)" }}
                      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                      animate={{ opacity: 0.9, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                      transition={{ duration: 0.4 }}
                    >
                      {BRAND_STATEMENTS[brandIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ─── BOOT MESSAGE (Level 3 Typing) ─── */}
              <div className="h-5 flex items-center justify-center w-full">
                {easterEgg ? (
                  <AnimatePresence mode="wait">
                    {showWelcome ? (
                      <motion.span
                        key="welcome"
                        className="text-xs font-mono tracking-wider"
                        style={{ color: "#00E5FF" }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        Welcome.
                      </motion.span>
                    ) : (
                      <motion.span
                        key="compiling"
                        className="text-xs font-mono tracking-wider"
                        style={{ color: "#A1A1AA" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        Compiling Intelligence...
                      </motion.span>
                    )}
                  </AnimatePresence>
                ) : (
                  <TypingText
                    text={AI_LOGS[bootStep]}
                    speed={25}
                    className="text-xs font-mono tracking-wider"
                    style={{ color: "#A1A1AA" }}
                  />
                )}
              </div>

              {/* ─── PROGRESS BAR (Level 5) ─── */}
              <div className="w-full flex flex-col items-center gap-2">
                <div
                  className="w-full h-[3px] rounded-full overflow-hidden relative"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                >
                  <motion.div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #00E5FF, #4F46E5, #38BDF8, #00E5FF)",
                      backgroundSize: "200% 100%",
                      boxShadow: "0 0 16px rgba(0,229,255,0.5), 0 0 32px rgba(0,229,255,0.2)",
                    }}
                    animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Shine sweep */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                      }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                    />
                  </motion.div>

                  {/* Glow tip */}
                  <div
                    className="absolute top-1/2 w-2 h-2 rounded-full pointer-events-none"
                    style={{
                      left: `${progress}%`,
                      transform: "translate(-50%, -50%)",
                      background: "radial-gradient(circle, rgba(0,229,255,0.9), transparent)",
                      boxShadow: "0 0 10px rgba(0,229,255,0.6)",
                    }}
                  />
                </div>

                {/* Stats row (Level 6) */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono" style={{ color: "#A1A1AA" }}>
                  <span style={{ color: "#00E5FF" }}>{progress}%</span>
                  <span>{Math.floor(progress * 5.12)} Assets</span>
                  <span>{Math.min(23, Math.floor(progress * 0.23))} Components</span>
                  <span>Latency {Math.max(2, 8 - Math.floor(progress / 18))}ms</span>
                  <span style={{ color: progress >= 100 ? "#00E5FF" : "#A1A1AA" }}>
                    {progress >= 100 ? "● Ready" : "● Stable"}
                  </span>
                </div>
              </div>

              {/* ─── AI LOGS (Level 4) ─── */}
              <div
                className="w-full rounded-xl p-3 flex flex-col gap-1 max-h-[120px] overflow-hidden"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {AI_LOGS.slice(0, visibleLogs).map((log, i) => (
                  <motion.div
                    key={log}
                    className="text-[10px] font-mono flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.02 }}
                  >
                    <span style={{ color: "#00E5FF" }}>[OK]</span>
                    <span style={{ color: "#A1A1AA" }}>{log.replace("[OK] ", "")}</span>
                  </motion.div>
                ))}
              </div>

              {/* ─── MODULE CHECKLIST ─── */}
              <div className="grid grid-cols-3 gap-x-6 gap-y-1.5 w-full">
                {MODULES.map((mod, i) => {
                  const isDone = i < completedModules;
                  return (
                    <motion.div
                      key={mod}
                      className="flex items-center gap-1.5 text-[11px] font-mono"
                      animate={{ opacity: isDone ? 1 : 0.25 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span
                        style={{
                          color: isDone ? "#00E5FF" : "rgba(255,255,255,0.15)",
                          textShadow: isDone ? "0 0 6px rgba(0,229,255,0.5)" : "none",
                        }}
                      >
                        {isDone ? "✓" : "○"}
                      </span>
                      <span style={{ color: isDone ? "#FFFFFF" : "rgba(255,255,255,0.2)" }}>
                        {mod}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ═══ AI ASSISTANT (Level 11) ═══ */}
          <motion.div
            className="absolute bottom-6 left-6 z-20 flex flex-col gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: progress > 20 ? 1 : 0, y: progress > 20 ? 0 : 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-[11px] font-mono" style={{ color: "#A1A1AA" }}>
              <span>AI Assistant</span>
              <motion.span
                style={{ color: "#00E5FF", fontSize: 8 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ●
              </motion.span>
              <span style={{ color: "#00E5FF" }}>Online</span>
            </div>
            {progress > 60 && (
              <motion.div
                className="text-[10px] font-mono"
                style={{ color: "rgba(255,255,255,0.4)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {getGreeting()}, Recruiter. Portfolio Ready.
              </motion.div>
            )}
          </motion.div>

          {/* ═══ VERSION BADGE ═══ */}
          <motion.div
            className="absolute bottom-6 right-6 text-[10px] font-mono tracking-widest z-20"
            style={{ color: "rgba(255,255,255,0.08)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            PORTFOLIO v2.0
          </motion.div>

          {/* Bottom decorative line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.15), transparent)",
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
