"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { m as motion, useInView } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Environment, ContactShadows, Cylinder, Torus, MeshReflectorMaterial, SpotLight } from "@react-three/drei";
import * as THREE from "three";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const certificates = [
  {
    title: "Google AI Essentials",
    issuer: "Google",
    date: "May 18, 2025",
    image: "/certificates/google.png",
    link: "https://coursera.org/verify/ZKGE1CXFE4WF"
  },
  {
    title: "Introduction to MongoDB (For Students)",
    issuer: "MongoDB",
    date: "May 18, 2025",
    image: "/certificates/mongodb.png",
    link: "https://drive.google.com/file/d/19SYPlFwZx0fALQMDReSV3pNlyN6JeNWr/view?usp=sharing"
  },
  {
    title: "Git Training",
    issuer: "Spoken Tutorial, IIT Bombay",
    date: "26 April 2025",
    image: "/certificates/git.png",
    link: "https://drive.google.com/file/d/116I18b1abCFHkz_ITQlL_ALXFmugMY-J/view?usp=sharing"
  },
  {
    title: "AI for Students: Build Your Own Generative AI Model",
    issuer: "NxtWave",
    date: "June 15, 2025",
    image: "/certificates/ai-model.png",
    link: "https://drive.google.com/file/d/1kqqA74k6kP-3cPXRRmwv-U7iGePZ0TwJ/view?usp=sharing"
  },
  {
    title: "Introduction to SQL",
    issuer: "Simplilearn",
    date: "3rd September 2025",
    image: "/certificates/sql.png",
    link: "https://drive.google.com/file/d/1nAjQxm8Yh3PS6UGQxPEapu19sr1DTx4M/view?usp=sharing"
  },
  {
    title: "No-code Machine Learning and Generative AI on AWS",
    issuer: "AWS Training & Certification",
    date: "April 15, 2026",
    image: "/certificates/aws.png",
    link: "https://drive.google.com/file/d/1fPQbG948qvS2srMBoThuHhrNp_M-pMMI/view?usp=sharing"
  }
];

function useCertificateTexture(imageUrl: string) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 1200; // 4:3 ratio
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Transparent background so the glass shows through padding
      ctx.clearRect(0, 0, 1600, 1200);

      const planeAspect = 1600 / 1200;
      const imgAspect = img.width / img.height;

      let drawWidth, drawHeight, drawX, drawY;

      if (imgAspect > planeAspect) {
        // Image is wider
        drawWidth = 1600;
        drawHeight = 1600 / imgAspect;
        drawX = 0;
        drawY = (1200 - drawHeight) / 2;
      } else {
        // Image is taller
        drawHeight = 1200;
        drawWidth = 1200 * imgAspect;
        drawX = (1600 - drawWidth) / 2;
        drawY = 0;
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 16;
      setTexture(tex);
    };
  }, [imageUrl]);

  return texture;
}

function CertificateMesh({ index, continuousIndex, total }: { index: number, continuousIndex: number, total: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const cert = certificates[index];
  const tex = useCertificateTexture(cert.image);

  const glassMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const texMatRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const activeFactorRef = useRef(0);

  const sliceAngle = (Math.PI * 2) / total;
  const radius = 4.5;

  const angle = index * sliceAngle;
  const baseX = Math.sin(angle) * radius;
  const baseZ = Math.cos(angle) * radius;
  const rotY = angle;

  const getOffset = () => {
    let offset = (index - continuousIndex) % total;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    return offset;
  };

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const offset = getOffset();
    const dt = Math.min(delta, 0.1);

    const targetIsActive = offset === 0 ? 1 : 0;
    activeFactorRef.current = THREE.MathUtils.damp(activeFactorRef.current, targetIsActive, 5, dt);

    const floatY = activeFactorRef.current * Math.sin(state.clock.elapsedTime * 2) * 0.1;
    meshRef.current.position.set(baseX, floatY, baseZ);
    meshRef.current.rotation.set(0, rotY, 0);

    const targetScale = 0.55 + (0.45 * activeFactorRef.current);
    meshRef.current.scale.setScalar(targetScale);

    const depthFactor = Math.cos(offset * sliceAngle);
    const targetOpacity = offset === 0 ? 1.0 : Math.max(0.1, (depthFactor + 1) / 2);

    if (glassMatRef.current) glassMatRef.current.opacity = THREE.MathUtils.damp(glassMatRef.current.opacity, targetOpacity, 5, dt);
    if (texMatRef.current) {
      texMatRef.current.opacity = THREE.MathUtils.damp(texMatRef.current.opacity, targetOpacity, 5, dt);
      texMatRef.current.emissiveIntensity = THREE.MathUtils.damp(texMatRef.current.emissiveIntensity, targetIsActive * 0.05, 5, dt);
    }
  });

  return (
    <group ref={meshRef}>
      <RoundedBox args={[4.2, 3.2, 0.05]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          ref={glassMatRef}
          color="#000000"
          metalness={0.9}
          roughness={0.05}
          transmission={0.9}
          thickness={0.5}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
        />
      </RoundedBox>

      {tex && (
        <mesh position={[0, 0, 0.026]}>
          <planeGeometry args={[4.0, 3.0]} />
          <meshPhysicalMaterial
            ref={texMatRef}
            map={tex}
            roughness={0.2}
            metalness={0.8}
            emissive="#00E5FF"
            emissiveIntensity={0}
            transparent
          />
        </mesh>
      )}

      <mesh position={[0, 0, -0.026]} rotation-y={Math.PI}>
        <planeGeometry args={[4.0, 3.0]} />
        <meshPhysicalMaterial
          color="#050505"
          metalness={0.8}
          roughness={0.4}
          transmission={0.6}
          transparent
        />
      </mesh>
    </group>
  );
}

function Pedestal() {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group position={[0, -1.75, 0]}>

      {/* 
        LAYER 1 (Bottom Base - Taller and narrower) 
      */}
      <group position={[0, -0.7, 0]}>
        <Cylinder args={[2.7, 2.9, 0.6, 64]}>
          <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.4} />
        </Cylinder>
        {/* Beveled glowing edge at the top of Layer 1 */}
        <Torus args={[2.7, 0.015, 16, 100]} rotation-x={Math.PI / 2} position={[0, 0.3, 0]}>
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.5} transparent opacity={0.5} />
        </Torus>
      </group>

      {/* 
        LAYER 2 (Middle Layer) 
      */}
      <group position={[0, -0.25, 0]}>
        <Cylinder args={[2.45, 2.6, 0.4, 64]}>
          <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
        </Cylinder>
        {/* Beveled glowing edge at the top of Layer 2 */}
        <Torus args={[2.45, 0.015, 16, 100]} rotation-x={Math.PI / 2} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} transparent opacity={0.8} />
        </Torus>
        {/* Ambient glow between layers */}
        <pointLight position={[0, -0.2, 0]} intensity={1.5} color="#00E5FF" distance={3} />
      </group>

      {/* 
        LAYER 3 (Top Glass Layer) 
      */}
      <group position={[0, 0.05, 0]}>
        {/* Top reflection plane perfectly aligned with the top surface */}
        <mesh position={[0, 0.101, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.2, 64]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={512}
            mixBlur={1.5}
            mixStrength={15}
            roughness={0.15}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.9}
            mirror={1}
          />
        </mesh>

        {/* Top smoked glass body */}
        <Cylinder args={[2.2, 2.2, 0.2, 64]}>
          <meshPhysicalMaterial
            color="#000000"
            metalness={0.9}
            roughness={0.05}
            transmission={0.9}
            thickness={0.5}
            ior={1.5}
            transparent
          />
        </Cylinder>

        {/* Polished metal rim for top layer */}
        <Torus args={[2.2, 0.03, 16, 100]} rotation-x={Math.PI / 2} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#888888" metalness={1} roughness={0.05} />
        </Torus>

        {/* Subtle inner cyan edge glow for top layer */}
        <Torus args={[2.16, 0.01, 16, 100]} rotation-x={Math.PI / 2} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1} />
        </Torus>
      </group>

      {/* Faint volumetric cyan light rising from the center */}
      <Cylinder args={[0.3, 2.2, 1.5, 64]} position={[0, 0.8, 0]}>
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.015} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </Cylinder>

      {/* Holographic concentric rings floating just above the platform */}
      <group ref={ringsRef} position={[0, 0.25, 0]}>
        <Torus args={[1.8, 0.005, 16, 100]} rotation-x={Math.PI / 2}>
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.6} transparent opacity={0.4} />
        </Torus>
        <Torus args={[1.4, 0.005, 16, 100]} rotation-x={Math.PI / 2} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.4} transparent opacity={0.3} />
        </Torus>
        <Torus args={[1.0, 0.005, 16, 100]} rotation-x={Math.PI / 2} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.3} transparent opacity={0.2} />
        </Torus>
      </group>

      {/* Soft radial light on the top surface where active certificate stands */}
      <pointLight position={[0, 0.5, 1]} intensity={1.0} color="#00E5FF" distance={4} />
      <pointLight position={[0, 0.5, -1]} intensity={0.5} color="#00E5FF" distance={4} />

    </group>
  );
}

/* Frame camera to the visible front area only (not the back of the carousel ring) */
function CameraFit() {
  const { camera, size } = useThree();
  const initializedRef = useRef(false);

  useFrame(() => {
    const perspCam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const fov = perspCam.fov * (Math.PI / 180);

    // Known visible scene geometry (tightened ~20% for larger on-screen appearance):
    // Front certificate: y = [-1.6, 1.6] (height 3.2), at z ≈ 0
    // Pedestal bottom:   y ≈ -2.75
    // Side certificates: x ≈ ±5.4 (scaled down)
    const visibleHeight = 5.2;  // expanded to fully include platform base + rings
    const visibleWidth = 8.5;   // tighter horizontal frame
    const centerY = -0.7;       // shifted further down to push scene upward on screen

    // Compute camera Z so the taller constraint (height or width) fits exactly
    const fitByHeight = (visibleHeight / 2) / Math.tan(fov / 2);
    const fitByWidth = (visibleWidth / 2) / (aspect * Math.tan(fov / 2));
    const targetZ = Math.max(fitByHeight, fitByWidth);
    const targetY = centerY * 0.3;

    if (!initializedRef.current) {
      perspCam.position.set(0, targetY, targetZ);
      perspCam.lookAt(0, centerY * 0.5, 0);
      initializedRef.current = true;
    } else {
      perspCam.position.z = THREE.MathUtils.damp(perspCam.position.z, targetZ, 3, 0.016);
      perspCam.position.y = THREE.MathUtils.damp(perspCam.position.y, targetY, 3, 0.016);
      perspCam.lookAt(0, centerY * 0.5, 0);
    }
  });

  return null;
}

/* ─── Moving-Head Stage Light Fixture (physical 3D model) ─── */
function MovingHeadFixture({ side }: { side: 'left' | 'right' }) {
  const fixtureRef = useRef<THREE.Group>(null);
  const mirrorSide = side === 'left' ? 1 : -1;

  // Tilt angle: head looks diagonally upward toward center
  const headTiltX = -0.65; // angle the barrel upward
  const headTiltZ = mirrorSide * 0.25; // slight inward cant

  return (
    <group ref={fixtureRef}>
      {/* ── Base Plate ── */}
      <Cylinder args={[0.38, 0.42, 0.08, 32]} position={[0, 0.04, 0]}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.25} />
      </Cylinder>
      {/* Base rim ring */}
      <Torus args={[0.40, 0.015, 16, 48]} rotation-x={Math.PI / 2} position={[0, 0.08, 0]}>
        <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.15} />
      </Torus>

      {/* ── Yoke / U-Frame ── */}
      <group position={[0, 0.18, 0]}>
        {/* Left yoke arm */}
        <mesh position={[-0.22, 0.22, 0]}>
          <boxGeometry args={[0.04, 0.44, 0.06]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Right yoke arm */}
        <mesh position={[0.22, 0.22, 0]}>
          <boxGeometry args={[0.04, 0.44, 0.06]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Yoke cross-bar (top) */}
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[0.48, 0.04, 0.06]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Head / Barrel (tilted to aim upward-center) ── */}
      <group position={[0, 0.55, 0]} rotation={[headTiltX, 0, headTiltZ]}>
        {/* Main barrel housing */}
        <Cylinder args={[0.18, 0.22, 0.5, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#0d0d0d" metalness={0.9} roughness={0.2} />
        </Cylinder>
        {/* Lens bezel (front ring) */}
        <Torus args={[0.19, 0.02, 16, 32]} position={[0, 0, 0.26]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.1} />
        </Torus>
        {/* Lens glass (front face — emissive white glow) */}
        <mesh position={[0, 0, 0.27]}>
          <circleGeometry args={[0.16, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
        </mesh>
        {/* Rear cap */}
        <mesh position={[0, 0, -0.26]} rotation={[Math.PI, 0, 0]}>
          <circleGeometry args={[0.18, 32]} />
          <meshStandardMaterial color="#080808" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Cooling fins (decorative rings) */}
        {[0.08, -0.04, -0.16].map((z, i) => (
          <Torus key={i} args={[0.20, 0.008, 8, 32]} position={[0, 0, z]}>
            <meshStandardMaterial color="#151515" metalness={0.85} roughness={0.3} />
          </Torus>
        ))}
      </group>
    </group>
  );
}

/* ─── Stage Lights: two bottom-mounted moving-heads with white beams ─── */
function StageLights() {
  const [target] = useState(() => new THREE.Object3D());
  const leftBeamRef = useRef<THREE.Group>(null);
  const rightBeamRef = useRef<THREE.Group>(null);
  const leftGlowRef = useRef<THREE.Mesh>(null);
  const rightGlowRef = useRef<THREE.Mesh>(null);

  // Very subtle breathing animation (95% → 100% intensity)
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Slow sinusoidal breathing — barely perceptible
    const breathL = 0.95 + 0.05 * Math.sin(t * 0.8);
    const breathR = 0.95 + 0.05 * Math.sin(t * 0.8 + 1.2); // phase offset

    if (leftBeamRef.current) leftBeamRef.current.scale.setScalar(breathL);
    if (rightBeamRef.current) rightBeamRef.current.scale.setScalar(breathR);

    // Subtle bloom opacity pulsing on the glow cones
    if (leftGlowRef.current) {
      (leftGlowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.035 * breathL;
    }
    if (rightGlowRef.current) {
      (rightGlowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.035 * breathR;
    }
  });

  // Positions: bottom-left and bottom-right of the scene, sitting on the floor plane
  const leftPos: [number, number, number] = [-5.5, -2.55, 3.5];
  const rightPos: [number, number, number] = [5.5, -2.55, 3.5];

  return (
    <>
      {/* Invisible aim target: center of front certificate area */}
      <primitive object={target} position={[0, 0.2, 0]} />

      {/* ════════ LEFT SPOTLIGHT ════════ */}
      <group position={leftPos}>
        {/* Physical moving-head fixture */}
        <MovingHeadFixture side="left" />

        {/* Volumetric white beam (drei SpotLight with fog) */}
        <group ref={leftBeamRef} position={[0, 0.55, 0]}>
          <SpotLight
            target={target}
            intensity={18}
            penumbra={0.5}
            angle={0.35}
            color="#ffffff"
            castShadow
            distance={20}
            attenuation={3}
            anglePower={3}
            volumetric
            opacity={0.25}
            radiusTop={0.02}
            radiusBottom={1.8}
          />
        </group>

        {/* Additive volumetric glow cone (visible fog in beam path) */}
        <mesh ref={leftGlowRef} position={[2.5, 1.5, -1.5]} rotation={[0.2, -0.45, 0.55]}>
          <coneGeometry args={[2.0, 8.0, 32, 1, true]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.035}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Subtle bloom halo at the lens */}
        <mesh position={[0, 0.55, 0.27]} rotation={[-0.65, 0, 0.25]}>
          <circleGeometry args={[0.5, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ════════ RIGHT SPOTLIGHT ════════ */}
      <group position={rightPos}>
        {/* Physical moving-head fixture */}
        <MovingHeadFixture side="right" />

        {/* Volumetric white beam (drei SpotLight with fog) */}
        <group ref={rightBeamRef} position={[0, 0.55, 0]}>
          <SpotLight
            target={target}
            intensity={18}
            penumbra={0.5}
            angle={0.35}
            color="#ffffff"
            castShadow
            distance={20}
            attenuation={3}
            anglePower={3}
            volumetric
            opacity={0.25}
            radiusTop={0.02}
            radiusBottom={1.8}
          />
        </group>

        {/* Additive volumetric glow cone (visible fog in beam path) */}
        <mesh ref={rightGlowRef} position={[-2.5, 1.5, -1.5]} rotation={[0.2, 0.45, -0.55]}>
          <coneGeometry args={[2.0, 8.0, 32, 1, true]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.035}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Subtle bloom halo at the lens */}
        <mesh position={[0, 0.55, 0.27]} rotation={[-0.65, 0, -0.25]}>
          <circleGeometry args={[0.5, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Bloom wash on pedestal surface from both lights */}
      <pointLight position={[-2, -1.2, 2]} intensity={0.4} color="#ffffff" distance={6} />
      <pointLight position={[2, -1.2, 2]} intensity={0.4} color="#ffffff" distance={6} />
    </>
  );
}

function ThreeCarousel({ continuousIndex, total }: { continuousIndex: number, total: number }) {
  const carouselGroupRef = useRef<THREE.Group>(null);
  const _reserved = useRef(null); // Preserve hook order for HMR stability
  const sliceAngle = (Math.PI * 2) / total;

  useFrame((_, delta) => {
    if (!carouselGroupRef.current) return;
    const dt = Math.min(delta, 0.1);

    const targetAngle = -continuousIndex * sliceAngle;

    carouselGroupRef.current.rotation.y = THREE.MathUtils.damp(
      carouselGroupRef.current.rotation.y,
      targetAngle,
      4,
      dt
    );
  });

  return (
    <>
      <CameraFit />

      <ambientLight intensity={0.2} color="#4488ff" />
      {/* Soft main key light for overall illumination */}
      <spotLight position={[0, 6, 8]} intensity={1.5} penumbra={0.6} color="#ffffff" castShadow />

      <StageLights />

      <Environment preset="night" />

      <Pedestal />

      <group position={[0, 0, -4.5]}>
        <group ref={carouselGroupRef}>
          {certificates.map((_, i) => (
            <CertificateMesh key={i} index={i} continuousIndex={continuousIndex} total={total} />
          ))}
        </group>
      </group>

      <ContactShadows position={[0, -2.8, 0]} opacity={0.4} scale={20} blur={3} far={3} color="#000000" />
    </>
  );
}

export default function Certificates() {
  const [continuousIndex, setContinuousIndex] = useState(0);
  const total = certificates.length;

  const next = () => setContinuousIndex((prev) => prev + 1);
  const prev = () => setContinuousIndex((prev) => prev - 1);

  const displayIndex = ((continuousIndex % total) + total) % total;

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold) next();
    else if (diff < -threshold) prev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(canvasContainerRef, { margin: "200px 0px 200px 0px" });

  const activeCert = certificates[displayIndex];

  return (
    <section id="certificates" className="relative py-24 md:pt-32 md:pb-40 overflow-hidden bg-background">
      <motion.div 
        className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 relative z-10"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
      >

        <div className="text-center mb-8">
          <span className="text-primary font-mono text-sm tracking-widest mb-4 block">06</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white uppercase tracking-wider mb-4">
            CERTIFICATIONS
          </h2>
          <p className="text-secondary-foreground text-lg max-w-xl mx-auto font-sans">
            Continuous learning is at the core of my journey. Here are some of the professional milestones I've achieved.
          </p>
        </div>

        <div ref={canvasContainerRef} className="relative w-full h-[78vh] min-h-[650px] max-h-[1000px] flex items-center justify-center">

          <div
            className="absolute inset-0 z-20"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          <Canvas frameloop={isInView ? 'always' : 'never'} camera={{ position: [0, 0, 10], fov: 50 }} className="z-10" dpr={[1, 2]}>
            <ThreeCarousel continuousIndex={continuousIndex} total={total} />
          </Canvas>
        </div>

        <div className="relative z-30 flex flex-col items-center mt-6">
          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={prev}
              className="flex w-10 h-10 rounded-full border border-white/20 bg-black/50 backdrop-blur-md items-center justify-center text-white hover:border-primary hover:text-primary hover:bg-black/80 hover:scale-110 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all duration-300"
              aria-label="Previous certificate"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-3">
              {certificates.map((_, i) => {
                // Calculate the difference to determine which dot is active
                const isActive = i === displayIndex;
                return (
                  <button
                    key={i}
                    // We jump by finding the closest path to the clicked index
                    onClick={() => {
                      const currentOffset = continuousIndex % total;
                      const normalizedCurrent = currentOffset >= 0 ? currentOffset : currentOffset + total;
                      let diff = i - normalizedCurrent;
                      if (diff > total / 2) diff -= total;
                      if (diff < -total / 2) diff += total;
                      setContinuousIndex(continuousIndex + diff);
                    }}
                    className={`transition-all duration-300 rounded-full ${isActive
                        ? "w-8 h-2.5 bg-primary shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                        : "w-2.5 h-2.5 bg-white/20 hover:bg-white/50"
                      }`}
                    aria-label={`Go to certificate ${i + 1}`}
                  />
                )
              })}
            </div>

            <button
              onClick={next}
              className="flex w-10 h-10 rounded-full border border-white/20 bg-black/50 backdrop-blur-md items-center justify-center text-white hover:border-primary hover:text-primary hover:bg-black/80 hover:scale-110 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all duration-300"
              aria-label="Next certificate"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <motion.div
            key={displayIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center flex flex-col items-center"
          >
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2 max-w-2xl">
              {activeCert.title}
            </h3>
            <p className="text-primary font-mono text-sm md:text-base mb-6">
              {activeCert.issuer} • {activeCert.date}
            </p>
            <a
              href={activeCert.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 text-white font-medium hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all duration-300 group"
            >
              <span>Verify Credential</span>
              <ExternalLink size={16} className="text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
