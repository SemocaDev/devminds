'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

const Projects = () => {
  const t = useTranslations('Projects');

  const projects = [
    { key: 'project1', tech: ['React', 'Node.js', 'MongoDB'], color: 'from-blue-600 to-cyan-600' },
    { key: 'project2', tech: ['Next.js', 'TypeScript', 'PostgreSQL'], color: 'from-purple-600 to-pink-600' },
    { key: 'project3', tech: ['Vue.js', 'Express', 'MySQL'], color: 'from-green-600 to-emerald-600' }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="projects" className="section-spacing bg-background">
      <div className="container-main">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="numbered-section section-title justify-center" data-number="03">
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
          {projects.map((project) => (
            <motion.div key={project.key} variants={item}>
              <Card className="group h-full flex flex-col hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 hover:border-primary/30">
                {/* Imagen con gradiente */}
                <div className="relative w-full h-56 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ExternalLink className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300" />
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {t(`${project.key}.title`)}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1">
                  <CardDescription className="leading-relaxed">
                    {t(`${project.key}.description`)}
                  </CardDescription>
                </CardContent>

                <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
                </CardFooter>
              </Card>
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
          <Button size="lg" variant="outline" className="group">
            {t('ctaButton')}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
