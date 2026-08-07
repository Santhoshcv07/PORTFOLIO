"use client";

import { useState, useEffect, useRef } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  rootMargin?: string;
  fallback?: React.ReactNode;
  id?: string;
}

export default function LazySection({ children, rootMargin = "500px", fallback = null, id }: LazySectionProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // Disconnect once it becomes visible so we don't keep observing
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return (
    <div ref={ref} id={id} className="min-h-[10vh]">
      {isIntersecting ? children : fallback}
    </div>
  );
}
