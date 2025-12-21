'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="container-main relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Error code animado */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <h1 className="text-[10rem] md:text-[14rem] font-bold leading-none">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                404
              </span>
            </h1>

            {/* Glitch effect */}
            <motion.div
              animate={{
                opacity: [0, 0.5, 0],
                x: [-2, 2, -2],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="absolute inset-0 text-[10rem] md:text-[14rem] font-bold leading-none text-primary/20 flex items-center justify-center"
            >
              404
            </motion.div>
          </motion.div>

          {/* Mensaje */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Página no encontrada
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </motion.div>

          {/* Code snippet decorativo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-block"
          >
            <div className="bg-card/50 backdrop-blur border border-border/50 rounded-lg p-4 font-mono text-sm text-left">
              <div className="text-muted-foreground">
                <span className="text-accent">if</span> (
                <span className="text-primary">pageNotFound</span>) {'{'}
              </div>
              <div className="text-muted-foreground pl-4">
                <span className="text-accent">return</span>{' '}
                <span className="text-orange-500">&lt;Home /&gt;</span>;
              </div>
              <div className="text-muted-foreground">{'}'}</div>
            </div>
          </motion.div>

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center pt-4"
          >
            <Link href="/">
              <Button size="lg" className="group">
                <Home className="mr-2 w-5 h-5" />
                Volver al Inicio
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              onClick={() => window.history.back()}
              className="group"
            >
              <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Ir Atrás
            </Button>
          </motion.div>

          {/* Links útiles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="pt-8 border-t border-border/50"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Páginas útiles:
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link href="/#about" className="text-primary hover:underline">
                Sobre Nosotros
              </Link>
              <Link href="/#services" className="text-primary hover:underline">
                Servicios
              </Link>
              <Link href="/#projects" className="text-primary hover:underline">
                Proyectos
              </Link>
              <Link href="/#contact" className="text-primary hover:underline">
                Contacto
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Efectos de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-accent/20 to-primary/20 blur-3xl"
        />
      </div>
    </div>
  );
}
