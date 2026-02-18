'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Code2 } from 'lucide-react';
import type { ProjectWithTranslation } from '@/db/queries/projects';

type Props = {
  projects?: ProjectWithTranslation[];
};

const Projects = ({ projects }: Props) => {
  const t = useTranslations('Projects');
  const params = useParams();
  const lang = params.lang as string;

  const featuredProjects = projects || [];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="projects" className="section-spacing bg-muted/50">
      <div className="container-main">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="numbered-section section-title justify-center" data-number="04">
            {t('title')}
          </h2>
          <p className="subtitle max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {featuredProjects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <Link href={`/${lang}/portfolio`}>
                <Card className="group h-full flex flex-col hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 hover:border-primary/30 cursor-pointer bracket-corners">
                  <div className="relative w-full h-56 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient || 'from-gray-700 to-gray-900'}`} />
                    {project.images?.[0] ? (
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority={false}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Code2 className="w-16 h-16 text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ExternalLink className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300" />
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <CardDescription className="leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardContent>

                  {project.technologies?.length > 0 && (
                  <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs px-3 py-1">
                        {tech}
                      </Badge>
                    ))}
                  </CardFooter>
                  )}
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href={`/${lang}/portfolio`}>
            <Button size="lg" variant="outline" className="group">
              {t('ctaButton')}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
