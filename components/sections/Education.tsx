"use client";

import { useRef, useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Award, BookOpen, Building, QrCode, Scan, ShieldCheck, RefreshCw } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, RoundedBox, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function generateFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  
  // Background: Matte Black / Gunmetal brushed effect
  const grad = ctx.createLinearGradient(0, 0, 512, 800);
  grad.addColorStop(0, "#1a1a1a");
  grad.addColorStop(0.5, "#0a0a0a");
  grad.addColorStop(1, "#111111");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 800);

  // Subtle brushed metal vertical lines
  ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
  for(let i=0; i<512; i+=3) {
    ctx.fillRect(i, 0, 1, 800);
  }
  
  // SC Logo Box
  ctx.fillStyle = "#00E5FF";
  ctx.fillRect(40, 40, 60, 60);
  ctx.fillStyle = "#000000";
  ctx.font = "bold 30px monospace";
  ctx.textAlign = "center";
  ctx.fillText("SC", 70, 78);
  
  // Top right text
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 16px monospace";
  ctx.textAlign = "right";
  ctx.fillText("IDENTITY CARD", 472, 60);
  ctx.fillStyle = "#BFC3C7";
  ctx.font = "14px monospace";
  ctx.fillText("STUDENT / EMP", 472, 80);
  
  // Photo placeholder area
  ctx.fillStyle = "#151515";
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(156, 160, 200, 200, 16);
  ctx.fill();
  
  ctx.fillStyle = "#BFC3C7";
  ctx.textAlign = "center";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("LOADING...", 256, 260);
  
  // Name
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 44px sans-serif";
  ctx.fillText("SANTHOSH CV", 256, 420);
  
  // Title
  ctx.fillStyle = "#00E5FF";
  ctx.font = "bold 22px monospace";
  ctx.fillText("AI ENGINEER", 256, 460);
  
  // Details box
  ctx.fillStyle = "#151515";
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(40, 520, 432, 130, 12);
  else ctx.rect(40, 520, 432, 130);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#222222";
  ctx.stroke();

  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "left";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText("Canara Engineering College", 60, 560);
  ctx.fillStyle = "#BFC3C7";
  ctx.font = "18px sans-serif";
  ctx.fillText("Computer Science & Design", 60, 590);
  
  ctx.beginPath();
  ctx.moveTo(60, 610);
  ctx.lineTo(452, 610);
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.fillStyle = "#BFC3C7";
  ctx.font = "18px monospace";
  ctx.fillText("ID NO.", 60, 635);
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "right";
  ctx.font = "bold 20px monospace";
  ctx.fillText("SCV-8829", 452, 635);
  
  // QR Code placeholder
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(40, 680, 80, 80);
  ctx.fillStyle = "#000000";
  ctx.fillRect(48, 688, 64, 64);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(55, 695, 20, 20);
  ctx.fillRect(85, 695, 20, 20);
  ctx.fillRect(55, 725, 20, 20);
  ctx.fillRect(85, 725, 20, 20);
  
  ctx.fillStyle = "#BFC3C7";
  ctx.textAlign = "right";
  ctx.font = "bold 14px monospace";
  ctx.fillText("SCAN TO VERIFY", 472, 700);
  
  // Fake barcode lines at bottom right
  ctx.fillStyle = "#FFFFFF";
  for(let i=0; i<20; i++) {
     ctx.fillRect(472 - (i*8), 720, Math.random()*4+1, 40);
  }
  
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 16;
  
  // Load photo asynchronously
  if (typeof window !== "undefined") {
    const img = new window.Image();
    img.src = "/profile.jpg"; // User's profile avatar
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      ctx.save();
      // Draw a rounded rectangle mask for the photo
      ctx.beginPath();
      // TypeScript lib.dom.d.ts includes roundRect, so no check is needed
      ctx.roundRect(156, 160, 200, 200, 16);
      ctx.clip();
      ctx.drawImage(img, 156, 160, 200, 200);
      ctx.restore();
      
      // Draw border over it
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#00E5FF"; // Cyan accent border
      ctx.beginPath();
      ctx.roundRect(156, 160, 200, 200, 16);
      ctx.stroke();
      tex.needsUpdate = true;
    };
  }

  return tex;
}

function generateBackTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  
  // Background: Matte Black / Gunmetal brushed effect
  const grad = ctx.createLinearGradient(0, 0, 512, 800);
  grad.addColorStop(0, "#111111");
  grad.addColorStop(0.5, "#0a0a0a");
  grad.addColorStop(1, "#1a1a1a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 800);

  // Subtle brushed metal vertical lines
  ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
  for(let i=0; i<512; i+=3) {
    ctx.fillRect(i, 0, 1, 800);
  }
  
  // Barcode strip
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 60, 512, 100);
  ctx.fillStyle = "#000000";
  for(let i=0; i<60; i++) {
     ctx.fillRect(30 + (i*7.6), 75, Math.random()*5+1, 70);
  }
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.font = "bold 18px monospace";
  ctx.fillText("8829-3991-0021-SCV", 256, 190);
  
  // QR Code
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(40, 240, 100, 100);
  ctx.fillStyle = "#000000";
  ctx.fillRect(45, 245, 90, 90);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(55, 255, 25, 25);
  ctx.fillRect(105, 255, 25, 25);
  ctx.fillRect(55, 305, 25, 25);
  
  // Links
  ctx.fillStyle = "#BFC3C7";
  ctx.textAlign = "left";
  ctx.font = "bold 18px monospace";
  ctx.fillText("PORTFOLIO", 180, 260);
  ctx.fillText("GITHUB", 180, 300);
  ctx.fillText("LINKEDIN", 180, 340);
  
  ctx.fillStyle = "#00E5FF";
  ctx.textAlign = "right";
  ctx.fillText("santhoshcv.dev", 472, 260);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("/santhoshcv", 472, 300);
  ctx.fillText("/in/santhoshcv", 472, 340);
  
  // Lines
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(180, 275); ctx.lineTo(472, 275); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(180, 315); ctx.lineTo(472, 315); ctx.stroke();
  
  // NFC
  ctx.fillStyle = "#151515";
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(40, 600, 160, 45, 8);
  else ctx.rect(40, 600, 160, 45);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#333333";
  ctx.stroke();

  ctx.fillStyle = "#00E5FF";
  ctx.textAlign = "center";
  ctx.font = "bold 16px monospace";
  ctx.fillText("NFC ENABLED", 120, 628);
  
  // Emergency
  ctx.fillStyle = "#BFC3C7";
  ctx.textAlign = "left";
  ctx.fillText("ISSUE DATE", 40, 690);
  ctx.textAlign = "right";
  ctx.fillText("EMERGENCY", 472, 690);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "left";
  ctx.font = "bold 18px monospace";
  ctx.fillText("AUG 2026", 40, 715);
  ctx.textAlign = "right";
  ctx.fillText("+91 00000 00000", 472, 715);
  
  // Footer
  ctx.fillStyle = "#00E5FF";
  ctx.fillRect(0, 750, 512, 50);
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.font = "bold 16px monospace";
  ctx.fillText("IF FOUND, PLEASE RETURN TO SANTHOSH CV", 256, 780);
  
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 16;
  return tex;
}

function BadgeModel({ isHovered, isFlipped, onFlip }: any) {
  const pivotRef = useRef<THREE.Group>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [noiseTexture, setNoiseTexture] = useState<THREE.Texture | null>(null);
  const [fabricTexture, setFabricTexture] = useState<THREE.Texture | null>(null);
  const [frontTex, setFrontTex] = useState<THREE.Texture | null>(null);
  const [backTex, setBackTex] = useState<THREE.Texture | null>(null);

  const physics = useRef({
    x: 0, vx: 0, tx: 0,
    y: 0, vy: 0, ty: 0,
    z: 0, vz: 0, tz: 0,
    lastMouseX: 0, lastMouseY: 0
  });

  const idleTime = useRef(0);

  useEffect(() => {
    const ft = generateFrontTexture();
    if (ft) setFrontTex(ft);
    
    const bt = generateBackTexture();
    if (bt) setBackTex(bt);

    // Generate Wear/Smudge Map for Plastic Sleeve
    const wearCanvas = document.createElement("canvas");
    wearCanvas.width = 512; wearCanvas.height = 512;
    const wCtx = wearCanvas.getContext("2d");
    if (wCtx) {
      wCtx.fillStyle = "rgb(255,255,255)"; 
      wCtx.fillRect(0,0,512,512);
      for(let i=0; i<40; i++) {
        wCtx.beginPath();
        wCtx.arc(Math.random()*512, Math.random()*512, Math.random()*30+15, 0, Math.PI*2);
        wCtx.fillStyle = `rgba(150, 150, 150, ${Math.random()*0.15})`; // Fingerprints
        wCtx.fill();
      }
      for(let i=0; i<1000; i++) {
        wCtx.fillStyle = `rgba(180, 180, 180, ${Math.random()*0.1})`; // Micro dust
        wCtx.fillRect(Math.random()*512, Math.random()*512, 1.5, 1.5);
      }
      const wTex = new THREE.CanvasTexture(wearCanvas);
      wTex.wrapS = wTex.wrapT = THREE.RepeatWrapping;
      setNoiseTexture(wTex);
    }

    // Generate Fabric Lanyard Map
    const fabCanvas = document.createElement("canvas");
    fabCanvas.width = 64; fabCanvas.height = 64;
    const fCtx = fabCanvas.getContext("2d");
    if (fCtx) {
      fCtx.fillStyle = "#111";
      fCtx.fillRect(0,0,64,64);
      fCtx.fillStyle = "#222";
      for(let i=0; i<64; i+=4) {
        fCtx.fillRect(0, i, 64, 1);
        fCtx.fillRect(i, 0, 1, 64);
      }
      const fTex = new THREE.CanvasTexture(fabCanvas);
      fTex.wrapS = fTex.wrapT = THREE.RepeatWrapping;
      fTex.repeat.set(1, 40);
      setFabricTexture(fTex);
    }
  }, []);

  useFrame((state, delta) => {
    if (!pivotRef.current) return;
    const dt = Math.min(delta, 0.1); 

    const p = physics.current;
    
    const mouseVelX = state.pointer.x - p.lastMouseX;
    const mouseVelY = state.pointer.y - p.lastMouseY;
    p.lastMouseX = state.pointer.x;
    p.lastMouseY = state.pointer.y;

    // Default target rotation is gravity (0) or flipped (Math.PI)
    p.tx = 0;
    p.ty = isFlipped ? Math.PI : 0;
    p.tz = 0;

    if (isHovered) {
      idleTime.current = 0;
      
      // MOUSE APPLIES PURE FORCE, NOT DIRECT ROTATION
      // Fast mouse movement literally hits and pushes the card
      if (Math.abs(mouseVelX) > 0.005) p.vy += mouseVelX * 25;
      if (Math.abs(mouseVelY) > 0.005) p.vx -= mouseVelY * 25;
      
      // Very slight magnetic drag towards mouse pointer
      p.vy += (state.pointer.x * 0.5 - p.vy) * 0.05;
      p.vx -= (state.pointer.y * 0.5 + p.vx) * 0.05;

    } else {
      idleTime.current += dt;
      // Ambient wind/breathing pendulum applies tiny forces
      p.vx += Math.sin(idleTime.current * 1.2) * 0.001;
      p.vz += Math.cos(idleTime.current * 0.9) * 0.0005;
    }

    // True Pendulum Spring Physics
    const stiffness = 45; // Gravity/Snap-back tension
    const damping = 0.92; // Realistic weight damping

    const forceX = (p.tx - p.x) * stiffness;
    p.vx += forceX * dt; p.vx *= damping; p.x += p.vx * dt;

    const forceY = (p.ty - p.y) * stiffness;
    p.vy += forceY * dt; p.vy *= damping; p.y += p.vy * dt;

    const forceZ = (p.tz - p.z) * stiffness;
    p.vz += forceZ * dt; p.vz *= damping; p.z += p.vz * dt;
    
    // Apply calculated rotations
    pivotRef.current.rotation.x = p.x;
    pivotRef.current.rotation.y = p.y;
    pivotRef.current.rotation.z = p.z;
    
    // Make the entire assembly swing slightly based on rotation, simulating a loose lanyard
    pivotRef.current.position.x = p.y * 0.3;
    pivotRef.current.position.z = -p.x * 0.3;
    
    // Subtle Camera Parallax
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, state.pointer.x * 0.4, 2, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, state.pointer.y * 0.4, 2, dt);
  });

  const handleFlipAndScan = () => {
    onFlip();
    physics.current.vy += isFlipped ? -5 : 5;
    physics.current.vx -= 1;
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <group ref={pivotRef} position={[0, 3, 0]}>
      {/* Anchor everything so it swings from the top */}
      <group position={[0, -3, 0]}>
        
        {/* Lanyard Strap */}
        <mesh position={[0, 7, 0]}>
          <planeGeometry args={[0.2, 10]} />
          <meshStandardMaterial color="#050505" map={fabricTexture} bumpMap={fabricTexture} bumpScale={0.05} roughness={0.9} />
        </mesh>

        {/* Metal Ring */}
        <mesh position={[0, 2.05, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.08, 0.02, 16, 32]} />
          <meshStandardMaterial color="#888" metalness={1} roughness={0.15} envMapIntensity={2} />
        </mesh>

        {/* Metal Clip Body */}
        <mesh position={[0, 1.85, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.2]} />
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.3} envMapIntensity={1.5} />
        </mesh>

        {/* Plastic Badge Holder Tab */}
        <mesh position={[0, 1.65, 0.01]}>
          <boxGeometry args={[0.5, 0.2, 0.02]} />
          <meshPhysicalMaterial color="#ffffff" transmission={1} opacity={0.3} transparent roughness={0.15} clearcoat={1} />
        </mesh>

        {/* Premium Transparent Plastic Badge Holder Sleeve */}
        <RoundedBox args={[2.0, 3.1, 0.06]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
          <meshPhysicalMaterial 
            color="#ffffff" 
            transmission={1} 
            transparent 
            opacity={0.3} 
            roughness={0.2}
            roughnessMap={noiseTexture}
            envMapIntensity={3} 
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>

        {/* Solid PVC Card Inside Holder - Metallic Base */}
        <RoundedBox args={[1.9, 3.0, 0.02]} radius={0.04} smoothness={4} position={[0, 0, -0.01]}>
          <meshStandardMaterial color="#111111" metalness={0.7} roughness={0.3} envMapIntensity={2} />
        </RoundedBox>

        {/* Native WebGL Front UI Print */}
        {frontTex && (
          <mesh position={[0, 0, 0.011]}>
             <planeGeometry args={[1.8, 2.9]} />
             <meshStandardMaterial map={frontTex} metalness={0.5} roughness={0.3} envMapIntensity={1.5} />
          </mesh>
        )}

        {/* Native WebGL Back UI Print */}
        {backTex && (
          <mesh position={[0, 0, -0.011]} rotation-y={Math.PI}>
             <planeGeometry args={[1.8, 2.9]} />
             <meshStandardMaterial map={backTex} metalness={0.5} roughness={0.3} envMapIntensity={1.5} />
          </mesh>
        )}

        {/* Invisible Click Plane to Trigger Flip & Scan */}
        <mesh position={[0, 0, 0.05]} visible={false} onClick={(e) => { e.stopPropagation(); handleFlipAndScan(); }}>
          <planeGeometry args={[2.0, 3.1]} />
        </mesh>
        <mesh position={[0, 0, -0.05]} visible={false} rotation-y={Math.PI} onClick={(e) => { e.stopPropagation(); handleFlipAndScan(); }}>
          <planeGeometry args={[2.0, 3.1]} />
        </mesh>

      </group>
    </group>
  );
}

function ThreeBadge() {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full h-[600px] flex items-center justify-center cursor-pointer perspective-[1000px]"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <Canvas camera={{ position: [0, 0, 7.5], fov: 40 }} className="z-10" dpr={[1, 2]}>
        
        {/* Cinematic AAA Lighting Setup */}
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 10, 5]} intensity={2} penumbra={1} castShadow />
        <spotLight position={[-5, 5, 5]} intensity={1.5} penumbra={1} color="#00E5FF" />
        <pointLight position={[0, -2, -5]} intensity={1.5} color="#ffffff" />
        
        <Environment preset="studio" />
        
        {/* Shift entire assembly slightly down by 0.7 units */}
        <group position={[0, -0.7, 0]}>
          <BadgeModel isHovered={isHovered} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />

          {/* Deep Contact Shadow */}
          <ContactShadows position={[0, -3.5, 0]} opacity={0.8} scale={15} blur={2.5} far={4} color="#000000" />
        </group>
      </Canvas>
    </div>
  );
}

export default function Education() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section id="education" ref={containerRef} className="relative py-32 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left - Content */}
          <motion.div 
            className="flex flex-col gap-10"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
          >
            <div>
              <span className="text-primary font-mono text-sm tracking-widest mb-4 block">04</span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-white uppercase tracking-wider mb-6">
                MY <span className="text-primary">EDUCATION</span>
              </h2>
              <p className="text-secondary-foreground text-lg leading-relaxed font-sans max-w-lg">
                My academic journey has equipped me with a strong foundation in computer science, problem-solving, and real-world application development.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Card 1: CGPA */}
              <motion.div 
                className="glass p-6 rounded-2xl flex flex-col gap-3 group border border-white/5 hover:border-[#00E5FF]/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,229,255,0.15)] transition-all duration-300"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1, delay: 0 }}
              >
                <GraduationCap size={24} className="text-primary group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="text-3xl font-hero text-white tracking-wider">7.5</div>
                  <div className="text-sm font-heading text-white">CGPA</div>
                  <div className="text-xs text-secondary-foreground">Overall</div>
                </div>
              </motion.div>

              {/* Card 2: Graduation */}
              <motion.div 
                className="glass p-6 rounded-2xl flex flex-col gap-3 group border border-white/5 hover:border-[#00E5FF]/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,229,255,0.15)] transition-all duration-300"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1, delay: 0.1 }}
              >
                <BookOpen size={24} className="text-primary group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="text-3xl font-hero text-white tracking-wider">2026</div>
                  <div className="text-sm font-heading text-white">Graduation</div>
                  <div className="text-xs text-secondary-foreground">Year</div>
                </div>
              </motion.div>

              {/* Card 3: Education Levels */}
              <motion.div 
                className="glass p-6 rounded-2xl flex flex-col gap-4 group border border-white/5 hover:border-[#00E5FF]/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,229,255,0.15)] transition-all duration-300 min-h-[240px]"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1, delay: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <Building size={24} className="text-primary group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-sm font-heading text-white">Education Levels</div>
                </div>
                
                <div className="flex flex-col gap-4 flex-grow justify-center mt-2">
                  <div className="text-sm text-secondary-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    B.E. Computer Science & Design Engineering
                  </div>
                  <div className="h-px w-full bg-white/5" />
                  <div className="text-sm text-secondary-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Pre-University Education
                  </div>
                  <div className="h-px w-full bg-white/5" />
                  <div className="text-sm text-secondary-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Secondary Education
                  </div>
                </div>
              </motion.div>

              {/* Card 4: Academic Journey */}
              <motion.div 
                className="glass p-6 rounded-2xl flex flex-col gap-4 group border border-white/5 hover:border-[#00E5FF]/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,229,255,0.15)] transition-all duration-300 min-h-[240px]"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1, delay: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <Award size={24} className="text-primary group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-sm font-heading text-white">Academic Journey</div>
                </div>
                
                <div className="flex flex-col gap-3 flex-grow justify-center mt-2">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-white font-medium">Canara Engineering College</div>
                    <div className="text-xs text-secondary-foreground flex items-center justify-between">
                      <span>Mangalore</span> 
                      <span className="text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">2022–2026</span>
                    </div>
                  </div>
                  <div className="h-px w-full bg-white/5" />
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-white font-medium">JCBM PU College</div>
                    <div className="text-xs text-secondary-foreground flex items-center justify-between">
                      <span>Sringeri</span> 
                      <span className="text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">2020–2022</span>
                    </div>
                  </div>
                  <div className="h-px w-full bg-white/5" />
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-white font-medium">Jaycees High School</div>
                    <div className="text-xs text-secondary-foreground flex items-center justify-between">
                      <span>Sringeri</span> 
                      <span className="text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">2019–2020</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Genuine AAA 3D ID Card */}
          <ThreeBadge />
        </div>
      </div>
    </section>
  );
}
