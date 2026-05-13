'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { ProjectWithTranslation, CategoryWithTranslation } from '@/db/queries/projects';
import { ExternalLink, Github, Code2 } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer/Footer';
import SocialSidebar from '@/app/components/layout/SocialSidebar';
import EmailSidebar from '@/app/components/layout/EmailSidebar';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  projects: ProjectWithTranslation[];
  categories: CategoryWithTranslation[];
};

export default function PortfolioClient({ projects, categories }: Props) {
  const t = useTranslations('Portfolio');
  const [selectedProject, setSelectedProject] = useState<ProjectWithTranslation | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const mainRef = useRef<HTMLElement>(null);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
      gsap.fromTo('.portfolio-hero',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease, delay: 0.1 }
      );
    }, mainRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
    gsap.fromTo('.project-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease, stagger: 0.08,
        scrollTrigger: { trigger: '.projects-grid', start: 'top 82%', once: false } }
    );
  }, [filteredProjects]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Navbar />
      <SocialSidebar />
      <EmailSidebar />

      <main ref={mainRef} className="flex-1">
        <section className="section-spacing bg-background">
          <div className="container-main">

            {/* Hero — alineado a la izquierda */}
            <div className="portfolio-hero opacity-0 mb-12">
              <p className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-[0.2em] uppercase mb-4">
                <span className="w-6 h-px bg-primary" />
                {t('label') || 'Portafolio'}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4 max-w-2xl">
                {t('title')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-[55ch] leading-relaxed">{t('subtitle')}</p>
            </div>

            {/* Filtro por categoría */}
            <Tabs defaultValue="all" onValueChange={setActiveCategory}>
              <div className="mb-10">
                <TabsList className="h-auto w-auto flex flex-wrap gap-1 p-1 bg-muted/40 rounded-xl">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="px-4 py-1.5 text-sm rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="projects-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                      <article
                        key={project.id}
                        className="project-card opacity-0 group border border-border/50 rounded-2xl overflow-hidden hover:border-foreground/30 transition-colors duration-300 cursor-pointer flex flex-col"
                        onClick={() => setSelectedProject(project)}
                      >
                        {/* Imagen */}
                        <div className="relative h-48 overflow-hidden bg-muted">
                          {project.images?.[0] ? (
                            <Image
                              src={project.images[0]}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Code2 className="w-12 h-12 text-muted-foreground/20" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                          {project.featured && (
                            <div className="absolute top-3 left-3">
                              <Badge variant="outline" className="bg-background/90 text-xs border-border/60">Featured</Badge>
                            </div>
                          )}
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 flex flex-col p-5">
                          <h3 className="font-display font-semibold mb-1.5 group-hover:text-foreground transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                            {project.description}
                          </p>
                          {project.technologies?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border/40">
                              {project.technologies.slice(0, 4).map((tech) => (
                                <Badge key={tech} variant="outline" className="text-xs px-2 py-0.5 border-border/50">
                                  {tech}
                                </Badge>
                              ))}
                              {project.technologies.length > 4 && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5 border-border/50">
                                  +{project.technologies.length - 4}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

          </div>
        </section>
      </main>

      <Footer />

      {/* Modal de detalle */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">{selectedProject.title}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {selectedProject.client && `${selectedProject.client} · `}{selectedProject.year}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {selectedProject.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                            <Image
                              src={image}
                              alt={`${selectedProject.title} - ${index + 1}`}
                              fill
                              className="object-contain p-4"
                              sizes="(max-width: 640px) 100vw, 700px"
                              priority={index === 0}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {selectedProject.images.length > 1 && (
                      <>
                        <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                        <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 z-10" />
                      </>
                    )}
                  </Carousel>
                )}

                {selectedProject.fullDescription && (
                  <div>
                    <p className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">{t('description')}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[65ch]">{selectedProject.fullDescription}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">{t('technologies')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs border-border/50">{tech}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {selectedProject.demo && (
                    <Button asChild className="flex-1 gap-2">
                      <a href={selectedProject.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />{t('viewDemo')}
                      </a>
                    </Button>
                  )}
                  {selectedProject.github && (
                    <Button variant="outline" asChild className="flex-1 gap-2 border-border/50 hover:border-foreground">
                      <a href={selectedProject.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />{t('viewCode')}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
