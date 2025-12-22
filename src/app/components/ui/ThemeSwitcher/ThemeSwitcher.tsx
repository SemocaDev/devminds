'use client';

import { useTheme } from '@/app/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const [mounted, setMounted] = useState(false);
  
  // Usar el hook del nuevo contexto
  let theme = 'system';
  let setTheme = (theme: 'light' | 'dark' | 'system') => {};
  
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    setTheme = themeContext.setTheme;
  } catch {
    // Si falla, usar valores por defecto
  }

  // Función para alternar entre light/dark (manteniendo compatibilidad)
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      // Si está en 'system', cambiar a 'dark'
      setTheme('dark');
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determinar qué icono mostrar basado en el tema
  const getIcon = () => {
    if (theme === 'system') {
      // Para system, mostrar según la preferencia real
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? <Moon size={20} /> : <Sun size={20} />;
      }
      return <Monitor size={20} />;
    }
    return theme === 'light' ? <Sun size={20} /> : <Moon size={20} />;
  };

  // No renderizar hasta que esté montado
  if (!mounted) {
    return (
      <div className="relative flex items-center justify-center p-2 w-10 h-10">
        <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center p-2 text-foreground hover:bg-accent rounded-md transition-colors duration-200 focus:outline-none ${className}`}
      aria-label={`Tema actual: ${theme}. Click para cambiar`}
      title={`Tema: ${theme}`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'light' ? 0 : theme === 'dark' ? 180 : 90,
          scale: 1
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {getIcon()}
      </motion.div>
    </button>
  );
};

export default ThemeSwitcher;