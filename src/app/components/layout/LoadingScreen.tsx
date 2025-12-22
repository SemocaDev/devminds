'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const t = useTranslations('LoadingScreen');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simular progreso de carga
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Esperar un poco antes de ocultar la pantalla
          setTimeout(() => {
            onLoadingComplete?.();
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="relative flex flex-col items-center gap-12">
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-4"
        >
          {/* Círculos decorativos animados */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute inset-0 -m-8"
          >
            <div className="w-32 h-32 rounded-full border-2 border-primary/20 border-t-primary" />
          </motion.div>

          {/* Logo/Texto central */}
          <div className="relative z-10 w-16 h-16 flex items-center justify-center">
            <span className="text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              DM
            </span>
          </div>
        </motion.div>

        {/* Nombre de la empresa con efecto typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            DevMinds
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-mono">
            {t('loading')}
          </p>
        </motion.div>

        {/* Barra de progreso */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-64 relative"
        >
          {/* Fondo de la barra */}
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            {/* Barra de progreso animada */}
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Porcentaje */}
          <div className="text-center mt-3">
            <span className="text-xs font-mono text-primary font-semibold">
              {progress}%
            </span>
          </div>
        </motion.div>

        {/* Puntos animados decorativos */}
        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-primary"
            />
          ))}
        </div>
      </div>

      {/* Efectos de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-accent/20 to-primary/20 blur-3xl"
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
