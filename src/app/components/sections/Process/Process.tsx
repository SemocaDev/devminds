'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, Lightbulb, Code2, Rocket, Headphones } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
  { key: 'step1', icon: MessageSquare, number: '01' },
  { key: 'step2', icon: Lightbulb,     number: '02' },
  { key: 'step3', icon: Code2,         number: '03' },
  { key: 'step4', icon: Rocket,        number: '04' },
  { key: 'step5', icon: Headphones,    number: '05' },
];

const totalDuration = 5;
const circleFillDuration = 0.6;
const stepDelay = (index: number) => (index / processSteps.length) * totalDuration;

export default function Process() {
  const t = useTranslations('Process');
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(trackRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
      gsap.fromTo('.process-header',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="section-spacing bg-background">
      <div className="container-main">

        <div className="process-header mb-16 opacity-0">
          <p className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-[0.2em] uppercase mb-4">
            <span className="w-6 h-px bg-primary" />
            05
          </p>
          <h2 className="section-title max-w-xl">{t('title')}</h2>
          <p className="subtitle max-w-lg mt-3">{t('subtitle')}</p>
        </div>

        {/* Desktop — horizontal */}
        <div ref={trackRef} className="hidden md:block relative">
          {/* Línea base */}
          <div className="absolute top-20 left-0 right-0 h-1 bg-border/30 rounded-full" />
          {/* Línea animada */}
          <motion.div
            className="absolute top-20 left-0 h-1 bg-foreground/70 rounded-full"
            initial={{ width: '0%' }}
            animate={isInView ? { width: '100%' } : { width: '0%' }}
            transition={{ duration: totalDuration, ease: 'linear' }}
          />

          <div className="grid grid-cols-5 gap-8">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              const delay = stepDelay(index);
              return (
                <div key={step.key} className="relative flex flex-col items-center text-center">
                  {/* Círculo contenedor */}
                  <div className="relative z-10 w-40 h-40 mb-6">
                    {/* Base gris */}
                    <div className="absolute inset-0 rounded-full bg-muted" />

                    {/* Borde animado que se dibuja */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-foreground/80"
                      initial={{ clipPath: 'polygon(0% 50%, 0% 50%, 0% 50%, 0% 50%)', opacity: 0 }}
                      animate={isInView
                        ? { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', opacity: 1 }
                        : { clipPath: 'polygon(0% 50%, 0% 50%, 0% 50%, 0% 50%)', opacity: 0 }}
                      transition={{ delay, duration: circleFillDuration, ease: 'easeOut' }}
                    />

                    {/* Fill interior suave */}
                    <motion.div
                      className="absolute inset-1 rounded-full bg-foreground/8"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      transition={{ delay, duration: circleFillDuration, ease: 'easeOut' }}
                    />

                    {/* Icono y número */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                      <motion.div
                        className="flex flex-col items-center gap-1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ delay: delay + circleFillDuration * 0.5, duration: 0.3 }}
                      >
                        <Icon className="w-12 h-12 text-foreground/70 mb-1" />
                        <span className="text-xs font-mono font-bold text-muted-foreground/50">
                          {step.number}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Texto */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: delay + circleFillDuration * 0.5, duration: 0.4 }}
                  >
                    <h3 className="font-semibold text-base mb-2">{t(`${step.key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`${step.key}.description`)}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile — vertical */}
        <div className="md:hidden relative pl-14">
          <div className="absolute left-5 top-0 bottom-0 w-1 bg-border/30 rounded-full" />
          <motion.div
            className="absolute left-5 top-0 w-1 bg-foreground/70 rounded-full"
            initial={{ height: '0%' }}
            animate={isInView ? { height: '100%' } : { height: '0%' }}
            transition={{ duration: totalDuration, ease: 'linear' }}
          />

          <div className="space-y-10">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              const delay = stepDelay(index);
              return (
                <div key={step.key} className="relative flex gap-6 items-start">
                  <div className="absolute -left-[2.6rem] z-10 w-12 h-12 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-muted" />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-foreground/70"
                      initial={{ clipPath: 'polygon(50% 0%, 50% 0%, 50% 0%, 50% 0%)', opacity: 0 }}
                      animate={isInView
                        ? { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', opacity: 1 }
                        : { clipPath: 'polygon(50% 0%, 50% 0%, 50% 0%, 50% 0%)', opacity: 0 }}
                      transition={{ delay, duration: circleFillDuration, ease: 'easeOut' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ delay: delay + circleFillDuration * 0.5, duration: 0.3 }}
                      >
                        <Icon className="w-5 h-5 text-foreground/70" />
                      </motion.div>
                    </div>
                  </div>

                  <motion.div
                    className="flex-1 pt-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ delay: delay + circleFillDuration * 0.5, duration: 0.4 }}
                  >
                    <span className="text-xs font-mono text-muted-foreground/40 block mb-1">{step.number}</span>
                    <h3 className="font-semibold text-sm mb-1">{t(`${step.key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`${step.key}.description`)}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
