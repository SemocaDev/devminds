"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TitleAnimationProps {
  text: string;
  speed?: number;
  className?: string;
}

export const TitleAnimation = ({
  text: fullText,
  speed = 80,
  className = "",
}: TitleAnimationProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 530);
      return () => clearInterval(cursorInterval);
    }
  }, [currentIndex, fullText, speed]);

  return (
    <div className={`container-main ${className}`}>
      <motion.h1
        className="hero-title mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {displayText}
        <motion.span
          animate={{ opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0.1 }}
          className="inline-block w-1.5 h-[0.85em] bg-primary ml-2 align-middle rounded-sm"
        />
      </motion.h1>
    </div>
  );
};
