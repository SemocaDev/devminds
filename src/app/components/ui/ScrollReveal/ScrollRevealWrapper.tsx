'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealWrapperProps {
  children: ReactNode;
  isVisible: boolean;
  delay?: number;
  className?: string;
}

const ScrollRevealWrapper = ({ 
  children, 
  isVisible, 
  delay = 0,
  className = '' 
}: ScrollRevealWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{
        duration: 0.7,
        delay: delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollRevealWrapper;