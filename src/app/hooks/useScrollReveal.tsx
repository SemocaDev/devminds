'use client';

import { useState, useEffect } from 'react';

export const useScrollReveal = (threshold: number = 100) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (hasScrolled) return;

    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setHasScrolled(true);
      }
    };

    // Verificar posición inicial
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, hasScrolled]);

  return { hasScrolled };
};