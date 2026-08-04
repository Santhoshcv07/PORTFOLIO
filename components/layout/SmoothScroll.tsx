"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.05, 
        duration: 1.2, 
        smoothWheel: true,
        wheelMultiplier: 0.9,
        syncTouch: true,
        touchMultiplier: 2,
        easing: (t) => 1 - Math.pow(1 - t, 4)
      }}
    >
      {children}
    </ReactLenis>
  );
}
