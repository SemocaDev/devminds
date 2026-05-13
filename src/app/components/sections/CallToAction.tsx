'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Zap, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const CallToAction = () => {
  const t = useTranslations('CTA');
  const params = useParams();
  const lang = params.lang as string;
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    { icon: Code,  text: t('feature1') },
    { icon: Zap,   text: t('feature2') },
    { icon: Check, text: t('feature3') },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        defaults: { ease },
      });
      tl.fromTo('.cta-badge',   { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo('.cta-title',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.1')
        .fromTo('.cta-desc',    { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .fromTo('.cta-feature', { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.07 }, '-=0.2')
        .fromTo('.cta-buttons', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.1');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-muted/20">
      <div className="container-main">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 xl:gap-20 items-center">

          {/* Contenido */}
          <div className="space-y-6 max-w-2xl">
            <div className="cta-badge inline-flex items-center gap-2 opacity-0">
              <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
              <span className="text-xs font-mono font-semibold text-muted-foreground tracking-[0.15em] uppercase">{t('status')}</span>
            </div>

            <h2 className="cta-title text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight opacity-0">
              {t('title')}
            </h2>
            <p className="cta-desc text-base md:text-lg text-muted-foreground leading-relaxed max-w-[55ch] opacity-0">
              {t('description')}
            </p>

            <div className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="cta-feature flex items-center gap-3 opacity-0">
                    <Icon className="w-4 h-4 text-foreground/50 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="cta-buttons flex flex-col sm:flex-row gap-3 items-start pt-2 opacity-0">
              <Button asChild size="lg" className="group gap-2 font-semibold">
                <Link href={`/${lang}/contact`}>
                  {t('buttonText')}
                  <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Bloque derecho — tipográfico, sin métricas falsas */}
          <div className="hidden lg:block">
            <div className="border border-border/50 rounded-2xl p-8 space-y-6 min-w-[220px]">
              <div className="space-y-1">
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Respuesta</div>
                <div className="text-2xl font-display font-bold">24 h</div>
              </div>
              <div className="h-px bg-border/40" />
              <div className="space-y-1">
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Tecnología</div>
                <div className="text-sm font-medium leading-relaxed text-muted-foreground">
                  Next.js · React<br />TypeScript · Node
                </div>
              </div>
              <div className="h-px bg-border/40" />
              <div className="space-y-1">
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Ubicación</div>
                <div className="text-sm font-medium text-muted-foreground">Neiva, Colombia</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CallToAction;
