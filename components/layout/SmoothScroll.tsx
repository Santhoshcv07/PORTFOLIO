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
        syncTouch: false,
        touchMultiplier: 0,
        wheelMultiplier: 0.9,
        easing: (t) => 1 - Math.pow(1 - t, 4)
      }}
    >
      {children}
    </ReactLenis>
  );
}
