'use client';

import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  show: boolean;
}

const ScrollIndicator = ({ show }: ScrollIndicatorProps) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-20 transition-opacity duration-500 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden={!show}
    >
      {/* Degradado más intenso para modo claro */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent dark:from-primary/10 dark:via-primary/5" />

      {/* Flechas animadas con colores más oscuros */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div className="flex flex-col items-center space-y-1 animate-scroll-bounce">
          <ChevronDown size={20} className="text-primary dark:text-primary/60 light:text-green-700" />
          <ChevronDown size={16} className="text-primary/80 dark:text-primary/40 light:text-green-600" />
          <ChevronDown size={12} className="text-primary/60 dark:text-primary/20 light:text-green-500" />
        </div>

        {/* Texto más visible */}
        <p className="text-xs text-gray-800 dark:text-text-tertiary mt-2 font-mono font-medium animate-scroll-text-pulse">
          Desliza para ver más
        </p>
      </div>
    </div>
  );
};

export default ScrollIndicator;
