'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, Code2 } from 'lucide-react';
import type { ProjectWithTranslation } from '@/db/queries/projects';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  projects?: ProjectWithTranslation[];
};

const Projects = ({ projects }: Props) => {
  const t = useTranslations('Projects');
  const params = useParams();
  const lang = params.lang as string;
  const sectionRef = useRef<HTMLElement>(null);

  const featuredProjects = projects || [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
      gsap.fromTo('.projects-header',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
      );
      gsap.fromTo('.project-card',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, ease, stagger: 0.12,
          scrollTrigger: { trigger: '.projects-grid', start: 'top 82%', once: true } }
      );
      gsap.fromTo('.projects-cta',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease,
          scrollTrigger: { trigger: '.projects-cta', start: 'top 90%', once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section-spacing bg-muted/20">
      <div className="container-main">

        <div className="projects-header mb-14 opacity-0">
          <p className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-[0.2em] uppercase mb-4">
            <span className="w-6 h-px bg-primary" />
            04
          </p>
          <h2 className="section-title max-w-xl">{t('title')}</h2>
          <p className="subtitle max-w-lg mt-3">{t('subtitle')}</p>
        </div>

        <div className="projects-grid grid md:grid-cols-3 gap-6 mb-12">
          {featuredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/${lang}/portfolio`}
              className="project-card group block opacity-0"
            >
              <article className="h-full flex flex-col border border-border/50 rounded-2xl overflow-hidden hover:border-foreground/30 transition-colors duration-300">
                {/* Imagen */}
                <div className="relative w-full h-52 overflow-hidden bg-muted">
                  {project.images?.[0] ? (
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                      priority={false}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <Code2 className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                  <ExternalLink className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Contenido */}
                <div className="flex-1 flex flex-col p-6">
                  <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-foreground transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {project.description}
                  </p>

                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border/40">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs px-2 py-0.5 border-border/50">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="projects-cta opacity-0">
          <Button asChild size="lg" variant="outline" className="group gap-2 border-foreground/20 hover:border-foreground font-semibold">
            <Link href={`/${lang}/portfolio`}>
              {t('ctaButton')}
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
};

export default Projects;
