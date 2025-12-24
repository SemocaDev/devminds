'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import projectsData from '@/config/projects.json';
import type { Project } from '@/types/projects';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer/Footer';
import SocialSidebar from '@/app/components/layout/SocialSidebar';
import EmailSidebar from '@/app/components/layout/EmailSidebar';

export default function PortfolioPage() {
  const t = useTranslations('Portfolio');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = activeCategory === 'all'
    ? projectsData.projects
    : projectsData.projects.filter(p => p.category === activeCategory);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Navbar />
      <SocialSidebar />
      <EmailSidebar />

      <main className="flex-1">
        <section className="section-spacing bg-background">
          <div className="container-main">
            {/* Hero */}
            <motion.div
              className="text-center mb-16 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="section-title">
                {t('title')}
              </h1>
              <p className="subtitle max-w-2xl mx-auto">
                {t('subtitle')}
              </p>
            </motion.div>

            {/* Category Tabs */}
            <Tabs defaultValue="all" onValueChange={setActiveCategory}>
              <div className="flex justify-center mb-12">
                <TabsList className="inline-flex h-auto w-auto flex-wrap justify-center gap-2 p-2">
                  {projectsData.categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="px-6">
                      {t(`categories.${category.id}`)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {projectsData.categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {filteredProjects.map((project) => (
                      <motion.div key={project.id} variants={item}>
                        <Card className="border-2 hover:shadow-2xl transition-all duration-500 hover:border-primary/50 overflow-hidden group cursor-pointer h-full flex flex-col"
                          onClick={() => setSelectedProject(project)}
                        >
                          {/* Project Image/Gradient */}
                          <div className={`h-56 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                            {project.images && project.images[0] && (
                              <Image
                                src={project.images[0]}
                                alt={t(`projects.${project.id}.title`)}
                                fill
                                className="object-cover group-hover:opacity-80 transition-opacity"
                                onError={(e) => {
                                  e.currentTarget.style.opacity = '0';
                                }}
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                              {project.featured && (
                                <Badge className="bg-white/90 text-black">Featured</Badge>
                              )}
                            </div>
                          </div>

                          <CardHeader className="flex-1">
                            <CardTitle className="group-hover:text-primary transition-colors">
                              {t(`projects.${project.id}.title`)}
                            </CardTitle>
                            <CardDescription>
                              {t(`projects.${project.id}.description`)}
                            </CardDescription>
                          </CardHeader>

                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech) => (
                                <Badge key={tech} variant="secondary">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>

                          <CardFooter className="flex gap-2 pt-4 border-t">
                            {project.demo && (
                              <Button
                                variant="default"
                                size="sm"
                                className="flex-1"
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  {t('viewDemo')}
                                </a>
                              </Button>
                            )}
                            {project.github && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <a href={project.github} target="_blank" rel="noopener noreferrer">
                                  <Github className="w-4 h-4 mr-2" />
                                  {t('viewCode')}
                                </a>
                              </Button>
                            )}
                            {!project.demo && !project.github && (
                              <Badge variant="secondary" className="flex-1 justify-center">
                                {t('noDemo')}
                              </Badge>
                            )}
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl">
                  {t(`projects.${selectedProject.id}.title`)}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {selectedProject.client} • {selectedProject.year}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Project Images Gallery con Carrusel */}
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {selectedProject.images.map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                                <Image
                                  src={image}
                                  alt={`${t(`projects.${selectedProject.id}.title`)} - Imagen ${index + 1}`}
                                  fill
                                  className="object-contain p-4"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
                                  priority={index === 0}
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        
                        {/* Navegación - solo mostrar si hay más de 1 imagen */}
                        {selectedProject.images.length > 1 && (
                          <>
                            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 z-10" />
                            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 z-10" />
                          </>
                        )}
                      </Carousel>
                    </div>

                    {/* Contador de imágenes */}
                    <div className="text-center text-sm text-muted-foreground">
                      {selectedProject.images.length} {selectedProject.images.length === 1 ? 'imagen' : 'imágenes'}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="pt-2">
                  <h3 className="text-xl font-semibold mb-3">{t('description')}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`projects.${selectedProject.id}.fullDescription`)}
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">{t('technologies')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-sm py-1.5 px-3">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-4 pt-4">
                  {selectedProject.demo && (
                    <Button asChild className="flex-1">
                      <a href={selectedProject.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {t('viewDemo')}
                      </a>
                    </Button>
                  )}
                  {selectedProject.github && (
                    <Button variant="outline" asChild className="flex-1">
                      <a href={selectedProject.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        {t('viewCode')}
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