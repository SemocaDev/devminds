'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const AboutUs = () => {
  const t = useTranslations('AboutUs');

  const technologies = [
    'React', 'Next.js', 'TypeScript', 'Node.js',
    'TailwindCSS', 'PostgreSQL', 'MongoDB', 'AWS'
  ];

  const stats = [
    { value: '50+', label: 'Proyectos' },
    { value: '100%', label: 'Satisfacción' },
    { value: '24/7', label: 'Soporte' }
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
            Sobre Nosotros
          </h2>

          {/* Grid 2 columnas */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Columna izquierda: Texto */}
            <div className="space-y-6">
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Somos <span className="text-primary font-semibold">DevMinds</span>, un equipo de
                  desarrolladores apasionados por crear soluciones digitales que transforman negocios.
                  Nos especializamos en desarrollo web moderno, aplicaciones móviles y consultoría tecnológica.
                </p>
                <p>
                  Nuestro enfoque se centra en entender las necesidades únicas de cada cliente
                  y traducirlas en productos digitales excepcionales que no solo cumplen,
                  sino que superan las expectativas.
                </p>
                <p>
                  Trabajamos con las tecnologías más recientes y las mejores prácticas de la industria
                  para garantizar que cada proyecto sea escalable, mantenible y de alta calidad.
                </p>
              </div>

              {/* Tecnologías */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Tecnologías que dominamos:
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
            </div>

            {/* Columna derecha: Imagen/Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary via-accent to-primary overflow-hidden relative">
                {/* Overlay con patrón */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />

                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                </div>

                {/* Logo o texto centrado */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl md:text-8xl font-bold text-white/20 select-none">
                    DM
                  </span>
                </div>
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