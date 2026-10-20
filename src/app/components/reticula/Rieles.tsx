'use client';

import { Github, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import contactConfig from '@/config/contact.json';

const enlace = 'text-muted-foreground transition-colors hover:text-primary';

/** Rieles fijos en los márgenes (solo con ancho ≥ 1360px, donde caben fuera de las guías). */
export default function Rieles() {
  const t = useTranslations('Home.rieles');
  return (
    <>
      <div className="fixed bottom-0 left-0 z-40 hidden w-10 flex-col items-center gap-5 pb-8 min-[1360px]:flex">
        <a href={contactConfig.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={enlace}>
          <Github className="size-[18px]" />
        </a>
        <a href={contactConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={enlace}>
          <Linkedin className="size-[18px]" />
        </a>
        <span className="h-20 w-px bg-guide" />
      </div>
      <div className="fixed bottom-0 right-0 z-40 hidden w-10 flex-col items-center gap-4 pb-8 min-[1360px]:flex">
        <span className="text-xs tracking-[0.08em] text-muted-foreground [writing-mode:vertical-rl]">{t('ubicacion')}</span>
        <span className="font-doto text-xs font-black text-foreground [writing-mode:vertical-rl]">2.93°N</span>
        <span className="h-20 w-px bg-guide" />
      </div>
    </>
  );
}
