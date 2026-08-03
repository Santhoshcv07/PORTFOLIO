"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export default function Cursor() {
  const [isMounted, setIsMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hoverRef = useRef(false);
  const visibleRef = useRef(false);
  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorRingX = useSpring(0, { stiffness: 250, damping: 20 });
  const cursorRingY = useSpring(0, { stiffness: 250, damping: 20 });

  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
    const moveCursor = (e: MouseEvent) => {
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
      
      lastPos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      const magneticElement = target.closest('[data-magnetic="true"]');
      
      if (magneticElement) {
        const rect = magneticElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        
        cursorX.set(centerX + distanceX * 0.1);
        cursorY.set(centerY + distanceY * 0.1);
        cursorRingX.set(centerX + distanceX * 0.2);
        cursorRingY.set(centerY + distanceY * 0.2);
        
        if (!hoverRef.current) {
          hoverRef.current = true;
          setIsHovering(true);
        }
      } else {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        cursorRingX.set(e.clientX);
        cursorRingY.set(e.clientY);
        
        const isClickable = !!target.closest('a, button, input, textarea, select, [role="button"]');
        if (hoverRef.current !== isClickable) {
          hoverRef.current = isClickable;
          setIsHovering(isClickable);
        }
      }
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };
    const handleMouseEnter = () => {
      visibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, cursorRingX, cursorRingY, isVisible]);

  if (!isMounted) return null;



  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-primary/50 rounded-full mix-blend-screen"
        style={{
          x: cursorRingX,
          y: cursorRingY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 1.5 : 1,
          boxShadow: "0 0 10px 0 rgba(0, 217, 255, 0.2), inset 0 0 10px 0 rgba(0, 217, 255, 0.2)",
          willChange: "transform",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />

    </div>
  );
}
