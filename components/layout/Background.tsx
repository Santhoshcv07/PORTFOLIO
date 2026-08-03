"use client";

import { useEffect, useRef, useState } from "react";
import { m as motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";

// Custom particles
function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random points
  const [positions] = useState(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00D9FF"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

export default function Background() {
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const mouseX = useSpring(rawMouseX, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(rawMouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle slightly with requestAnimationFrame if desired, but framer-motion handles it well.
      rawMouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawMouseY.set(-(e.clientY / window.innerHeight) * 2 + 1);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawMouseX, rawMouseY]);

  // Scroll Parallax
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Derived transforms
  const gridX = useTransform(mouseX, (x) => x * -10);
  const gridY = useTransform([mouseY, parallaxY], ([m, p]: any) => m * 10 + p);
  const glow1X = useTransform(mouseX, (x) => x * 20);
  const glow1Y = useTransform([mouseY, parallaxY], ([m, p]: any) => m * -20 + p * 0.5);
  const glow2X = useTransform(mouseX, (x) => x * -30);
  const glow2Y = useTransform([mouseY, parallaxY], ([m, p]: any) => m * 30 + p * 0.8);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* 3D Particles & Stars */}
      <div className="absolute inset-0 opacity-50">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          <FloatingParticles />
        </Canvas>
      </div>

      {/* Animated Grid */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          x: gridX,
          y: gridY,
        }}
      />

      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: "url('/assets/images/noise.png')",
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Gradient Glows */}
      <motion.div 
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[80px] will-change-transform"
        style={{
          background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
          x: glow1X,
          y: glow1Y,
          transform: "translateZ(0)"
        }}
      />
      <motion.div 
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[100px] will-change-transform"
        style={{
          background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
          x: glow2X,
          y: glow2Y,
          transform: "translateZ(0)"
        }}
      />
    </div>
  );
}
