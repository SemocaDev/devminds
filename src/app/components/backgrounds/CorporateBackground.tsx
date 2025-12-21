'use client';

import { ReactNode } from 'react';

interface CorporateBackgroundProps {
  children: ReactNode;
  className?: string;
}

const CorporateBackground = ({ children, className = '' }: CorporateBackgroundProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Subtle gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at top, hsl(var(--muted) / 0.3) 0%, transparent 50%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CorporateBackground;