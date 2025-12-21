'use client';

import { useTheme } from '@/app/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const [mounted, setMounted] = useState(false);
  
  // Solo usar el hook después de que el componente esté montado
  let theme = 'light';
  let toggleTheme = () => {};
  
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch {
    // Si falla, usar valores por defecto hasta que se monte el provider
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // No renderizar hasta que esté montado para evitar hydration mismatch
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
      aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'light' ? 0 : 180,
          scale: 1
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {theme === 'light' ? (
          <Sun size={20} className="text-foreground" />
        ) : (
          <Moon size={20} className="text-foreground" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeSwitcher;