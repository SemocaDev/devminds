"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const t = useTranslations("Hero");

  return (
    <section className="container-main min-h-screen flex items-center justify-center relative">
      <div className="w-full max-w-5xl mx-auto">
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
            Hola, somos
          </motion.p>

          {/* Título gigante con gradiente */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hero-title"
          >
            DevMinds
          </motion.h1>

          {/* Subtítulo grande */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground"
          >
            Construimos soluciones digitales profesionales
          </motion.p>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Somos una empresa especializada en desarrollo web, aplicaciones móviles
            y consultoría tecnológica. Transformamos ideas en productos digitales
            excepcionales.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-wrap gap-4 justify-center pt-4"
          >
            <Button size="lg" className="group">
              Ver Proyectos
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Contactar
            </Button>
          </motion.div>
        </motion.div>

        {/* Círculos decorativos de fondo */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-accent/10 to-primary/10 blur-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
