'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  xOffset: number;
}

interface HeroBackgroundProps {
  particleCount?: number;
  speed?: number;
  opacity?: number;
}

export default function HeroBackground({
  particleCount = 50,
  speed = 20,
  opacity = 0.3,
}: HeroBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generar partículas solo en el cliente para evitar hydration mismatch
  useEffect(() => {
    const generatedParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * speed + speed,
      delay: Math.random() * 2,
      xOffset: Math.random() * 20 - 10,
    }));
    setParticles(generatedParticles);
  }, [particleCount, speed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />

      {/* Partículas flotantes */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: opacity,
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.xOffset, 0],
            scale: [1, 1.2, 1],
            opacity: [opacity, opacity * 1.5, opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Grid opcional sutil */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}
