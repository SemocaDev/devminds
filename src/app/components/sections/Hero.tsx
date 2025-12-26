"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import HeroBackground from "@/app/components/backgrounds/HeroBackground";

const Hero = () => {
  const t = useTranslations("Hero");
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "DevMinds";

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 200);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background animado con partículas - Full width solo en Hero */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <HeroBackground particleCount={40} speed={25} opacity={0.4} />
      </div>

      <div className="container-main w-full max-w-5xl mx-auto relative z-10">
        {/* Contenido centrado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center space-y-6 md:space-y-8"
        >
          {/* Pequeño saludo */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-primary font-mono text-sm md:text-base"
          >
            {t("greeting")}
          </motion.p>

          {/* Título gigante con gradiente y efecto typewriter */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hero-title relative"
          >
            {displayedText}
            <span className="cursor-blink">_</span>
          </motion.h1>

          {/* Subtítulo grande */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground"
          >
            {t("mainSubtitle")}
          </motion.p>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {t("description")}
          </motion.p>

          {/* CTAs - VERSIÓN CORREGIDA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-wrap gap-4 justify-center pt-4"
          >
            {/* Botón View Projects - Versión moderna sin legacyBehavior */}
            <Button
              asChild
              size="lg"
              className="group cursor-pointer"
            >
              <Link href="/portfolio">
                {t("viewProjects")}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Botón Contact - Versión moderna sin legacyBehavior */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
            >
              <Link href="/contact">
                {t("contactButton")}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;