'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useState, useRef, useMemo } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface Connection {
  from: Node;
  to: Node;
  delay: number;
}

interface BackgroundParticle {
  id: number;
  x: number;
  y: number;
  xOffset: number;
  duration: number;
  delay: number;
}

const NetworkAnimation = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Generar partículas de fondo una sola vez con useMemo
  const backgroundParticles = useMemo<BackgroundParticle[]>(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      xOffset: Math.random() * 20 - 10,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 2,
    }));
  }, []);

  useEffect(() => {
    // Nodo central (punto de inicio)
    const centerNode: Node = { id: 0, x: 50, y: 50, delay: 0 };

    // Generar red de nodos de manera orgánica
    const generatedNodes: Node[] = [centerNode];
    const generatedConnections: Connection[] = [];

    // Primera expansión - 3 nodos desde el centro
    const firstLevel = [
      { id: 1, x: 35, y: 30, delay: 0.3 },
      { id: 2, x: 65, y: 35, delay: 0.5 },
      { id: 3, x: 50, y: 70, delay: 0.7 },
    ];

    firstLevel.forEach(node => {
      generatedNodes.push(node);
      generatedConnections.push({
        from: centerNode,
        to: node,
        delay: node.delay - 0.2,
      });
    });

    // Segunda expansión - más nodos desde los primeros
    const secondLevel = [
      { id: 4, x: 20, y: 20, delay: 1.0 },
      { id: 5, x: 30, y: 45, delay: 1.1 },
      { id: 6, x: 70, y: 20, delay: 1.2 },
      { id: 7, x: 80, y: 50, delay: 1.3 },
      { id: 8, x: 40, y: 85, delay: 1.4 },
      { id: 9, x: 65, y: 80, delay: 1.5 },
    ];

    // Conectar nodos de segundo nivel con los del primero
    secondLevel.forEach((node, idx) => {
      generatedNodes.push(node);
      const parentNode = firstLevel[idx % firstLevel.length];
      generatedConnections.push({
        from: parentNode,
        to: node,
        delay: node.delay - 0.2,
      });
    });

    // Tercera expansión - nodos periféricos
    const thirdLevel = [
      { id: 10, x: 10, y: 10, delay: 1.8 },
      { id: 11, x: 15, y: 35, delay: 1.9 },
      { id: 12, x: 25, y: 60, delay: 2.0 },
      { id: 13, x: 85, y: 15, delay: 2.1 },
      { id: 14, x: 90, y: 40, delay: 2.2 },
      { id: 15, x: 90, y: 70, delay: 2.3 },
      { id: 16, x: 75, y: 90, delay: 2.4 },
      { id: 17, x: 50, y: 95, delay: 2.5 },
      { id: 18, x: 20, y: 80, delay: 2.6 },
    ];

    // Conectar nodos de tercer nivel
    thirdLevel.forEach((node, idx) => {
      generatedNodes.push(node);
      const parentNode = secondLevel[idx % secondLevel.length];
      generatedConnections.push({
        from: parentNode,
        to: node,
        delay: node.delay - 0.2,
      });
    });

    // Agregar algunas conexiones cruzadas para hacer la red más densa
    const crossConnections = [
      { from: generatedNodes[1], to: generatedNodes[2], delay: 2.8 },
      { from: generatedNodes[4], to: generatedNodes[5], delay: 2.9 },
      { from: generatedNodes[6], to: generatedNodes[7], delay: 3.0 },
      { from: generatedNodes[8], to: generatedNodes[9], delay: 3.1 },
      { from: generatedNodes[11], to: generatedNodes[13], delay: 3.2 },
    ];

    setNodes(generatedNodes);
    setConnections([...generatedConnections, ...crossConnections]);
  }, []);

  // No renderizar nada hasta que esté en viewport
  if (!isInView) {
    return <div ref={ref} className="relative w-full h-full" />;
  }

  return (
    <div ref={ref} className="relative w-full h-full">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ willChange: 'transform' }}
      >
        <defs>
          {/* Gradiente para las líneas */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
          </linearGradient>

          {/* Filtro de brillo suave */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Renderizar conexiones (líneas) */}
        {connections.map((connection, idx) => (
          <motion.line
            key={`connection-${idx}`}
            x1={connection.from.x}
            y1={connection.from.y}
            x2={connection.to.x}
            y2={connection.to.y}
            stroke="url(#lineGradient)"
            strokeWidth="0.3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: connection.delay,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Renderizar nodos */}
        {nodes.map((node) => (
          <g key={`node-${node.id}`}>
            {/* Círculo de pulso exterior */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="2"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 1.5],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                delay: node.delay,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeOut",
              }}
            />

            {/* Nodo principal */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.id === 0 ? "1.2" : "0.8"}
              fill="hsl(var(--primary))"
              filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: node.delay,
                ease: "backOut",
              }}
            />

            {/* Anillo interior del nodo */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.id === 0 ? "0.6" : "0.4"}
              fill="white"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{
                duration: 0.5,
                delay: node.delay + 0.1,
                ease: "backOut",
              }}
            />
          </g>
        ))}
      </svg>

      {/* Efecto de partículas flotantes en el fondo - usando CSS */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundParticles.map((particle) => (
          <div
            key={`particle-${particle.id}`}
            className="absolute w-1 h-1 rounded-full bg-primary/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              '--x-offset': `${particle.xOffset}px`,
              '--duration': `${particle.duration}s`,
              '--delay': `${particle.delay}s`,
              animation: `float-particle var(--duration) ease-in-out var(--delay) infinite`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
};

export default NetworkAnimation;
