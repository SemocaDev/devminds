'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NetworkAnimation from '@/app/components/animations/NetworkAnimation';

const AboutUs = () => {
  const t = useTranslations('AboutUs');
  const params = useParams();
  const lang = params.lang as string;

  const technologies = [
    'React', 'Next.js', 'TypeScript', 'Node.js',
    'TailwindCSS', 'PostgreSQL', 'MongoDB', 'AWS'
  ];

  const stats = [
    { value: '50+', label: t('stats.projects') },
    { value: '100%', label: t('stats.satisfaction') },
    { value: '24/7', label: t('stats.support') }
  ];

  return (
    <section id="about" className="section-spacing bg-background">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Título numerado */}
          <h2 className="numbered-section section-title" data-number="01">
            {t('title')}
          </h2>

          {/* Grid 2 columnas */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Columna izquierda: Texto */}
            <div className="space-y-6 relative">
              {/* Elemento decorativo con dots */}
              <div className="absolute -top-4 -left-4 w-32 h-32 pattern-dots-sparse opacity-95 pointer-events-none -z-10" />
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {t('paragraph1')}
                </p>
                <p>
                  {t('paragraph2')}
                </p>
                <p>
                  {t('paragraph3')}
                </p>
              </div>

              {/* Tecnologías */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  {t('technologiesLabel')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="px-3 py-1 text-xs font-medium"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Meet the Team Button */}
              <div className="pt-6">
                <Link href={`/${lang}/about`}>
                  <Button variant="outline" className="group">
                    {t('meetTheTeam')}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Columna derecha: Animación de Red */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 overflow-hidden relative border border-primary/10">
                {/* Animación de red interconectada */}
                <NetworkAnimation />

                {/* Overlay sutil en hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              {/* Efecto de sombra en hover */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;