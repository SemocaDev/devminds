"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealOptions = {
  y?: number;
  stagger?: number;
  duration?: number;
  delay?: number;
};

export function useGsapReveal<T extends HTMLElement = HTMLElement>(
  selector: string,
  options: RevealOptions = {}
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const { y = 32, stagger = 0.1, duration = 0.7, delay = 0 } = options;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        selector,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
}
