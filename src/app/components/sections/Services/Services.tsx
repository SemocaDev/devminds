'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Code2, Palette, Search, Wrench, ArrowUpRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { key: 'webdev',     icon: Code2,    number: '01' },
  { key: 'custom',     icon: Wrench,   number: '02' },
  { key: 'wordpress',  icon: Palette,  number: '03' },
  { key: 'consulting', icon: Search,   number: '04' },
];

const Services = () => {
  const t = useTranslations('Services');
  const params = useParams();
  const lang = params.lang as string;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
      gsap.fromTo('.services-header',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
      );
      gsap.fromTo('.service-card',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.55, ease, stagger: 0.09,
          scrollTrigger: { trigger: '.services-grid', start: 'top 82%', once: true } }
      );
      gsap.fromTo('.services-cta',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease,
          scrollTrigger: { trigger: '.services-cta', start: 'top 90%', once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="section-spacing bg-muted/20">
      <div className="container-main">

        <div className="services-header mb-14 opacity-0">
          <p className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-[0.2em] uppercase mb-4">
            <span className="w-6 h-px bg-primary" />
            02
          </p>
          <h2 className="section-title max-w-xl">{t('title')}</h2>
          <p className="subtitle max-w-lg mt-3">{t('subtitle')}</p>
        </div>

        {/* Grid 2×2 — evita las 4 columnas genéricas */}
        <div className="services-grid grid md:grid-cols-2 gap-px bg-border/40 border border-border/40 rounded-2xl overflow-hidden mb-12">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.key}
                href={`/${lang}/services#${service.key}`}
                className="service-card group block opacity-0 bg-background hover:bg-muted/30 transition-colors duration-200"
              >
                <div className="h-full p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-10 h-10 rounded-lg border border-border/60 flex items-center justify-center group-hover:border-foreground/40 transition-colors duration-200">
                      <Icon className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors duration-200" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground/50">{service.number}</span>
                  </div>

                  <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-foreground transition-colors duration-200">
                    {t(`${service.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`${service.key}.description`)}
                  </p>

                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-foreground/40 group-hover:text-foreground/80 transition-all duration-200">
                    Ver más <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="services-cta opacity-0">
          <Button asChild size="lg" variant="outline" className="group gap-2 border-foreground/20 hover:border-foreground font-semibold">
            <Link href={`/${lang}/services`}>
              {t('ctaButton')}
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
};

export default Services;
