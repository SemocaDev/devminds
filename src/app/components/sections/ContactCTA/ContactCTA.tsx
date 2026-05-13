'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const ContactCTA = () => {
  const t = useTranslations('ContactCTA');
  const params = useParams();
  const lang = params.lang as string;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        defaults: { ease },
      });
      tl.fromTo('.contact-label', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo('.contact-title', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
        .fromTo('.contact-sub',   { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .fromTo('.contact-status',{ opacity: 0 },         { opacity: 1, duration: 0.4 }, '-=0.2')
        .fromTo('.contact-btns',  { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.1');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="section-spacing bg-background">
      <div className="container-main">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 xl:gap-20 items-end">

          {/* Texto */}
          <div className="space-y-6">
            <p className="contact-label inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-[0.2em] uppercase opacity-0">
              <span className="w-6 h-px bg-primary" />
              07
            </p>

            <h2 className="contact-title text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight max-w-2xl opacity-0">
              {t('title')}
            </h2>

            <p className="contact-sub text-base md:text-lg text-muted-foreground max-w-[55ch] leading-relaxed opacity-0">
              {t('subtitle')}
            </p>

            <div className="contact-status flex items-center gap-2 text-sm text-muted-foreground opacity-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground/40 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground/60" />
              </span>
              {t('responseTime')}
            </div>

            <div className="contact-btns flex flex-col sm:flex-row gap-3 pt-2 opacity-0">
              <Button asChild size="lg" className="group gap-2 font-semibold">
                <Link href={`/${lang}/contact`}>
                  {t('primaryButton')}
                  <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group gap-2 border-foreground/20 hover:border-foreground">
                <Link href="mailto:semoca00@gmail.com">
                  <Mail className="w-4 h-4" />
                  {t('secondaryButton')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Bloque derecho — número grande tipográfico */}
          <div className="hidden lg:block text-right pb-2">
            <div className="text-[11rem] xl:text-[13rem] font-display font-extrabold leading-none text-foreground/6 select-none">
              07
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
