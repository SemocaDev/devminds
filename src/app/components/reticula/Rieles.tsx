'use client';

import { Github, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import contactConfig from '@/config/contact.json';
import { cn } from '@/lib/utils';

const enlace = 'text-muted-foreground transition-colors hover:text-primary';

/**
 * Rieles en los márgenes fuera del marco (≥ 1360px).
 * `hero`: anclados a la sección que los contiene (arrancan en la cruz bajo la navbar).
 * `pagina`: como `hero` pero solo el riel izquierdo; a la derecha está la cartela de las páginas internas.
 * `fijo`: pegados a la ventana, para las páginas que aún no usan la retícula.
 */
export default function Rieles({ modo = 'hero' }: { modo?: 'fijo' | 'hero' | 'pagina' }) {
  const t = useTranslations('Home.rieles');
  const lado = cn(
    'z-[2] hidden w-16 flex-col items-center gap-5 min-[1360px]:flex',
    modo === 'fijo' ? 'fixed bottom-8' : 'absolute top-[88px]'
  );
  return (
    <>
      <div className={cn(lado, 'left-0')}>
        <a href={contactConfig.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={enlace}>
          <Github className="size-[18px]" />
        </a>
        <a href={contactConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={enlace}>
          <Linkedin className="size-[18px]" />
        </a>
        <span className="text-xs tracking-[0.08em] text-muted-foreground [writing-mode:vertical-rl]">GitHub · LinkedIn</span>
      </div>
      {modo !== 'pagina' && (
        <div className={cn(lado, 'right-0')}>
          <span className="text-xs tracking-[0.08em] text-muted-foreground [writing-mode:vertical-rl]">{t('ubicacion')}</span>
        </div>
      )}
      {modo === 'hero' && (
        <span className="absolute bottom-3 right-0 z-[2] hidden w-16 text-center font-doto text-xs font-black text-foreground min-[1360px]:block">
          2.93°N
        </span>
      )}
    </>
  );
}
