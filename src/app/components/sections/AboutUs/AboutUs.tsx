'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const technologies = [
  'React', 'Next.js', 'TypeScript', 'Node.js',
  'TailwindCSS', 'PostgreSQL', 'MongoDB', 'AWS'
];

const AboutUs = () => {
  const t = useTranslations('AboutUs');
  const params = useParams();
  const lang = params.lang as string;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        defaults: { ease },
      });

      tl.fromTo('.about-label', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo('.about-title', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.65 }, '-=0.2')
        .fromTo('.about-text p', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }, '-=0.3')
        .fromTo('.about-badge', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.05 }, '-=0.2')
        .fromTo('.about-cta', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.1')
        .fromTo('.about-visual', { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.8 }, '<-0.6');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section-spacing bg-background">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* Columna izquierda */}
          <div className="space-y-8">
            <div>
              <p className="about-label inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-[0.2em] uppercase mb-4 opacity-0">
                <span className="w-6 h-px bg-primary" />
                01
              </p>
              <h2 className="about-title section-title opacity-0">
                {t('title')}
              </h2>
            </div>

            <div className="about-text space-y-4 text-muted-foreground leading-relaxed max-w-[65ch]">
              <p className="opacity-0">{t('paragraph1')}</p>
              <p className="opacity-0">{t('paragraph2')}</p>
              <p className="opacity-0">{t('paragraph3')}</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest">
                {t('technologiesLabel')}
              </p>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="about-badge px-3 py-1 text-xs font-medium opacity-0 border-border/60"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="about-cta opacity-0">
              <Link href={`/${lang}/about`}>
                <Button variant="outline" className="group gap-2 border-foreground/20 hover:border-foreground">
                  {t('meetTheTeam')}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Columna derecha: bloque editorial */}
          <div className="about-visual opacity-0 lg:pt-8">
            <div className="space-y-6 pl-8 border-l border-border/50">
              <blockquote className="text-2xl md:text-3xl font-display font-medium leading-snug text-foreground/80">
                {t('paragraph1')}
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-foreground/30" />
                <span className="text-sm font-mono text-muted-foreground">DevMinds Team</span>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-3">
                {['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind', 'Node.js', 'AWS'].map((tech) => (
                  <div key={tech} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-foreground/30 flex-shrink-0" />
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;
