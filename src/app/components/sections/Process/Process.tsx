'use client';

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageSquare,
  Lightbulb,
  Code2,
  Rocket,
  Headphones
} from "lucide-react";

const processSteps = [
  {
    key: "step1",
    icon: MessageSquare,
    number: "01",
  },
  {
    key: "step2",
    icon: Lightbulb,
    number: "02",
  },
  {
    key: "step3",
    icon: Code2,
    number: "03",
  },
  {
    key: "step4",
    icon: Rocket,
    number: "04",
  },
  {
    key: "step5",
    icon: Headphones,
    number: "05",
  },
];

export default function Process() {
  const t = useTranslations("Process");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Duración total de la animación (en segundos)
  const totalDuration = 5;
  // Tiempo que tarda en llegar a cada step
  const stepDelay = (index: number) => (index / processSteps.length) * totalDuration;
  // Duración del fill de cada círculo
  const circleFillDuration = 0.6;

  return (
    <section id="process" className="section-spacing bg-background" ref={ref}>
      <div className="container-main">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="numbered-section section-title justify-center" data-number="05">
            {t("title")}
          </h2>
          <p className="subtitle max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Timeline - Horizontal en desktop, vertical en mobile */}
        <div className="relative">
          {/* Desktop - Horizontal */}
          <div className="hidden md:block">
            {/* Línea conectora base (gris) */}
            <div className="absolute top-20 left-0 right-0 h-1 bg-border/30 rounded-full" />

            {/* Línea conectora animada (primary) */}
            <motion.div
              className="absolute top-20 left-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg"
              initial={{ width: "0%" }}
              animate={isInView ? { width: "100%" } : { width: "0%" }}
              transition={{ duration: totalDuration, ease: "linear" }}
            />

            {/* Steps */}
            <div className="grid grid-cols-5 gap-8">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                const delay = stepDelay(index);

                return (
                  <div
                    key={step.key}
                    className="relative flex flex-col items-center text-center"
                  >
                    {/* Circle Container */}
                    <div className="relative z-10 w-40 h-40 mb-6">
                      {/* Círculo base (gris apagado) - siempre visible, sin borde */}
                      <div className="absolute inset-0 rounded-full bg-muted" />

                      {/* Borde del círculo animado (la línea se convierte en el borde) */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-primary"
                        initial={{
                          clipPath: "polygon(0% 50%, 0% 50%, 0% 50%, 0% 50%)",
                          opacity: 0
                        }}
                        animate={isInView ? {
                          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                          opacity: 1
                        } : {
                          clipPath: "polygon(0% 50%, 0% 50%, 0% 50%, 0% 50%)",
                          opacity: 0
                        }}
                        transition={{
                          delay: delay,
                          duration: circleFillDuration,
                          ease: "easeOut"
                        }}
                      />

                      {/* Fill interior del círculo */}
                      <motion.div
                        className="absolute inset-1 rounded-full bg-gradient-to-br from-primary/20 to-accent/20"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={{
                          delay: delay,
                          duration: circleFillDuration,
                          ease: "easeOut"
                        }}
                      />

                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isInView ? { scale: 1.2, opacity: 0.5 } : { scale: 0, opacity: 0 }}
                        transition={{
                          delay: delay,
                          duration: circleFillDuration,
                          ease: "easeOut"
                        }}
                      />

                      {/* Icon y número (aparecen cuando el círculo se llena) */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                          transition={{
                            delay: delay + circleFillDuration * 0.5,
                            duration: 0.3
                          }}
                        >
                          <Icon className="w-12 h-12 text-primary mb-2" />
                          <span className="text-xs font-bold text-muted-foreground">
                            {step.number}
                          </span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Content (texto aparece cuando el círculo se llena) */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{
                        delay: delay + circleFillDuration * 0.5,
                        duration: 0.4
                      }}
                    >
                      <h3 className="font-bold text-lg mb-2">
                        {t(`${step.key}.title`)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t(`${step.key}.description`)}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile - Vertical */}
          <div className="md:hidden">
            {/* Línea conectora base (gris) */}
            <div className="absolute left-10 top-0 bottom-0 w-1 bg-border/30 rounded-full" />

            {/* Línea conectora animada (primary) */}
            <motion.div
              className="absolute left-10 top-0 w-1 bg-gradient-to-b from-primary to-accent rounded-full shadow-lg"
              initial={{ height: "0%" }}
              animate={isInView ? { height: "100%" } : { height: "0%" }}
              transition={{ duration: totalDuration, ease: "linear" }}
            />

            {/* Steps */}
            <div className="space-y-12">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                const delay = stepDelay(index);

                return (
                  <div key={step.key} className="relative flex gap-6">
                    {/* Circle Container */}
                    <div className="relative z-10 w-20 h-20 flex-shrink-0">
                      {/* Círculo base (gris apagado) - siempre visible, sin borde */}
                      <div className="absolute inset-0 rounded-full bg-muted" />

                      {/* Borde del círculo animado (la línea se convierte en el borde) */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-primary"
                        initial={{
                          clipPath: "polygon(50% 0%, 50% 0%, 50% 0%, 50% 0%)",
                          opacity: 0
                        }}
                        animate={isInView ? {
                          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                          opacity: 1
                        } : {
                          clipPath: "polygon(50% 0%, 50% 0%, 50% 0%, 50% 0%)",
                          opacity: 0
                        }}
                        transition={{
                          delay: delay,
                          duration: circleFillDuration,
                          ease: "easeOut"
                        }}
                      />

                      {/* Fill interior del círculo */}
                      <motion.div
                        className="absolute inset-1 rounded-full bg-gradient-to-br from-primary/20 to-accent/20"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={{
                          delay: delay,
                          duration: circleFillDuration,
                          ease: "easeOut"
                        }}
                      />

                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20 blur-lg"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isInView ? { scale: 1.3, opacity: 0.5 } : { scale: 0, opacity: 0 }}
                        transition={{
                          delay: delay,
                          duration: circleFillDuration,
                          ease: "easeOut"
                        }}
                      />

                      {/* Icon y número (aparecen cuando el círculo se llena) */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                          className="flex flex-col items-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                          transition={{
                            delay: delay + circleFillDuration * 0.5,
                            duration: 0.3
                          }}
                        >
                          <Icon className="w-8 h-8 text-primary" />
                          <span className="text-xs font-bold text-muted-foreground mt-1">
                            {step.number}
                          </span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Content (aparece cuando el círculo se llena) */}
                    <motion.div
                      className="flex-1 pt-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{
                        delay: delay + circleFillDuration * 0.5,
                        duration: 0.4
                      }}
                    >
                      <h3 className="font-bold text-lg mb-2">
                        {t(`${step.key}.title`)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t(`${step.key}.description`)}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
