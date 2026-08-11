'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
      const scrollTrigger = { trigger: sectionRef.current, start: 'top 75%', once: true };

      gsap.fromTo('.process-header',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease, scrollTrigger }
      );

      // Líneas de progreso (desktop horizontal + mobile vertical)
      gsap.fromTo('.process-line-desktop', { width: '0%' }, { width: '100%', duration: totalDuration, ease: 'linear', scrollTrigger });
      gsap.fromTo('.process-line-mobile', { height: '0%' }, { height: '100%', duration: totalDuration, ease: 'linear', scrollTrigger });

      processSteps.forEach((_, index) => {
        const delay = stepDelay(index);
        gsap.fromTo(`.process-ring-${index}`,
          { clipPath: 'polygon(0% 50%, 0% 50%, 0% 50%, 0% 50%)', opacity: 0 },
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', opacity: 1, delay, duration: circleFillDuration, ease: 'power2.out', scrollTrigger }
        );
        gsap.fromTo(`.process-fill-${index}`,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, delay, duration: circleFillDuration, ease: 'power2.out', scrollTrigger }
        );
        gsap.fromTo(`.process-icon-${index}`,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, delay: delay + circleFillDuration * 0.5, duration: 0.3, scrollTrigger }
        );
        gsap.fromTo(`.process-text-${index}`,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, delay: delay + circleFillDuration * 0.5, duration: 0.4, scrollTrigger }
        );
      });
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
        <div className="hidden md:block relative">
          {/* Línea base */}
          <div className="absolute top-20 left-0 right-0 h-1 bg-border/30 rounded-full" />
          {/* Línea animada */}
          <div className="process-line-desktop absolute top-20 left-0 h-1 bg-foreground/70 rounded-full" style={{ width: 0 }} />

          <div className="grid grid-cols-5 gap-8">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="relative flex flex-col items-center text-center">
                  {/* Círculo contenedor */}
                  <div className="relative z-10 w-40 h-40 mb-6">
                    {/* Base gris */}
                    <div className="absolute inset-0 rounded-full bg-muted" />

                    {/* Borde animado que se dibuja */}
                    <div
                      className={`process-ring-${index} absolute inset-0 rounded-full border-4 border-foreground/80`}
                      style={{ clipPath: 'polygon(0% 50%, 0% 50%, 0% 50%, 0% 50%)', opacity: 0 }}
                    />

                    {/* Fill interior suave */}
                    <div
                      className={`process-fill-${index} absolute inset-1 rounded-full bg-foreground/8`}
                      style={{ transform: 'scale(0)', opacity: 0 }}
                    />

                    {/* Icono y número */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                      <div
                        className={`process-icon-${index} flex flex-col items-center gap-1`}
                        style={{ opacity: 0, transform: 'scale(0.8)' }}
                      >
                        <Icon className="w-12 h-12 text-foreground/70 mb-1" />
                        <span className="text-xs font-mono font-bold text-muted-foreground/50">
                          {step.number}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Texto */}
                  <div className={`process-text-${index}`} style={{ opacity: 0 }}>
                    <h3 className="font-semibold text-base mb-2">{t(`${step.key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`${step.key}.description`)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile — vertical */}
        <div className="md:hidden relative pl-14">
          <div className="absolute left-5 top-0 bottom-0 w-1 bg-border/30 rounded-full" />
          <div className="process-line-mobile absolute left-5 top-0 w-1 bg-foreground/70 rounded-full" style={{ height: 0 }} />

          <div className="space-y-10">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="relative flex gap-6 items-start">
                  <div className="absolute -left-[2.6rem] z-10 w-12 h-12 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-muted" />
                    <div
                      className={`process-ring-${index} absolute inset-0 rounded-full border-2 border-foreground/70`}
                      style={{ clipPath: 'polygon(50% 0%, 50% 0%, 50% 0%, 50% 0%)', opacity: 0 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`process-icon-${index}`} style={{ opacity: 0, transform: 'scale(0.8)' }}>
                        <Icon className="w-5 h-5 text-foreground/70" />
                      </div>
                    </div>
                  </div>

                  <div className={`process-text-${index} flex-1 pt-1`} style={{ opacity: 0 }}>
                    <span className="text-xs font-mono text-muted-foreground/40 block mb-1">{step.number}</span>
                    <h3 className="font-semibold text-sm mb-1">{t(`${step.key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`${step.key}.description`)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
