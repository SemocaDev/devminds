'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Palette, Wrench, Users, ArrowRight, CheckCircle2, Cloud } from 'lucide-react';
import {
  SiReact, SiNextdotjs, SiTypescript, SiNodedotjs, SiPostgresql,
  SiMongodb, SiTailwindcss, SiDocker, SiGit, SiFigma, SiWordpress,
  SiVercel, SiExpress, SiPhp, SiPostman,
} from 'react-icons/si';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer/Footer';
import SocialSidebar from '@/app/components/layout/SocialSidebar';
import EmailSidebar from '@/app/components/layout/EmailSidebar';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { key: 'webdev',     icon: Code2,    number: '01' },
  { key: 'custom',     icon: Wrench,   number: '02' },
  { key: 'wordpress',  icon: Palette,  number: '03' },
  { key: 'consulting', icon: Users,    number: '04' },
];

const techStack = {
  frontend: [
    { icon: SiReact,       name: 'React'       },
    { icon: SiNextdotjs,   name: 'Next.js'     },
    { icon: SiTypescript,  name: 'TypeScript'  },
    { icon: SiTailwindcss, name: 'Tailwind CSS'},
  ],
  backend: [
    { icon: SiNodedotjs,   name: 'Node.js'    },
    { icon: SiExpress,     name: 'Express'    },
    { icon: SiPostgresql,  name: 'PostgreSQL' },
    { icon: SiMongodb,     name: 'MongoDB'    },
  ],
  cms: [
    { icon: SiWordpress, name: 'WordPress' },
    { icon: SiPhp,       name: 'PHP'       },
  ],
  devops: [
    { icon: SiGit,    name: 'Git'    },
    { icon: SiDocker, name: 'Docker' },
    { icon: Cloud,    name: 'Cloud'  },
    { icon: SiVercel, name: 'Vercel' },
  ],
  tools: [
    { icon: SiFigma,   name: 'Figma'   },
    { icon: SiPostman, name: 'Postman' },
  ],
};

export default function ServicesPage() {
  const t = useTranslations('ServicesPage');
  const params = useParams();
  const lang = params.lang as string;
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && services.some(s => s.key === hash)) {
      setOpenAccordion(hash);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
      gsap.fromTo('.services-hero',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease, delay: 0.1 }
      );
      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease,
            scrollTrigger: { trigger: el, start: 'top 82%', once: true } }
        );
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <EmailSidebar />

      <div ref={mainRef} className="min-h-screen flex flex-col">

        {/* Hero — sin gradiente, tipografía pura */}
        <section className="section-spacing bg-background">
          <div className="container-main">
            <div className="services-hero opacity-0 max-w-2xl">
              <p className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-[0.2em] uppercase mb-4">
                <span className="w-6 h-px bg-primary" />
                {t('hero.pageLabel')}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-[55ch]">
                {t('hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Servicios accordion */}
        <section className="pb-20 bg-background">
          <div className="container-main">
            <div className="gsap-reveal opacity-0 mb-10">
              <h2 className="text-2xl font-display font-bold">{t('services.title')}</h2>
            </div>

            <Accordion
              type="single"
              collapsible
              className="space-y-2"
              value={openAccordion}
              onValueChange={setOpenAccordion}
            >
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <AccordionItem
                    key={service.key}
                    id={service.key}
                    value={service.key}
                    className="gsap-reveal opacity-0 border border-border/50 rounded-xl px-6 bg-background data-[state=open]:border-foreground/30 transition-colors duration-200"
                  >
                    <AccordionTrigger className="hover:no-underline py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-foreground/70" />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-muted-foreground/40">{service.number}</span>
                            <h3 className="font-display font-semibold text-base">
                              {t(`services.items.${service.key}.title`)}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {t(`services.items.${service.key}.shortDescription`)}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 pl-13">
                      <div className="space-y-5 pl-[3.25rem]">
                        <p className="text-muted-foreground leading-relaxed max-w-[65ch]">
                          {t(`services.items.${service.key}.description`)}
                        </p>

                        <div>
                          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                            {t('services.technologies')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t(`services.items.${service.key}.technologies`)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                            {t('services.idealFor')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t(`services.items.${service.key}.idealFor`)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
                            {t('services.features')}
                          </p>
                          <ul className="space-y-2">
                            {(t.raw(`services.items.${service.key}.features`) as string[]).map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-20 bg-muted/20">
          <div className="container-main">
            <div className="gsap-reveal opacity-0 mb-10">
              <h2 className="text-2xl font-display font-bold mb-2">{t('techStack.title')}</h2>
              <p className="text-muted-foreground max-w-[55ch]">{t('techStack.subtitle')}</p>
            </div>

            <div className="space-y-8 max-w-4xl">
              {Object.entries(techStack).map(([category, techs]) => (
                <div key={category} className="gsap-reveal opacity-0">
                  <p className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
                    {t(`techStack.categories.${category}`)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech) => {
                      const TechIcon = tech.icon;
                      return (
                        <Badge
                          key={tech.name}
                          variant="outline"
                          className="px-3 py-1.5 text-sm gap-2 border-border/50 hover:border-foreground/40 transition-colors cursor-default"
                        >
                          <TechIcon className="w-3.5 h-3.5" />
                          <span>{tech.name}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-spacing bg-background">
          <div className="container-main">
            <div className="gsap-reveal opacity-0 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{t('cta.title')}</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed max-w-[55ch]">{t('cta.subtitle')}</p>
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
              >
                {t('cta.button')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
