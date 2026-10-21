'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Github, Linkedin, Mail } from 'lucide-react';
import LogoHorizontal from '@/app/components/marca/LogoHorizontal';
import SelectorIdioma from '@/app/components/layout/SelectorIdioma';
import contactConfig from '@/config/contact.json';
import { enlaceCorreo } from '@/lib/enlaces';
import { cn } from '@/lib/utils';

const enlace = 'inline-flex min-h-11 items-center gap-2 text-sm text-background/70 transition-colors hover:text-background';

/** Pie de página en carbón con wordmark, navegación, redes e idioma. */
export default function Footer({ conBarraMovil = false }: { conBarraMovil?: boolean }) {
  const t = useTranslations('Footer');
  const { lang } = useParams<{ lang: string }>();
  const anio = new Date().getFullYear();

  const navegacion = [
    { label: t('nav.home'), href: `/${lang}` },
    { label: t('nav.services'), href: `/${lang}/services` },
    { label: t('nav.portfolio'), href: `/${lang}/portfolio` },
    { label: t('nav.about'), href: `/${lang}/about` },
    { label: t('nav.contact'), href: `/${lang}/contact` },
  ];

  return (
    <footer className={cn('mt-auto bg-foreground text-background', conBarraMovil && 'pb-[76px] md:pb-0')}>
      <div className="contenedor-reticula py-14">
        <div className="grid gap-y-10 md:grid-cols-4">
          <div className="px-4 md:px-6">
            <LogoHorizontal tono="oscuro" alto={36} />
            <p className="mt-3 max-w-xs text-sm text-background/70">{t('tagline')}</p>
            <SelectorIdioma tono="oscuro" className="-ml-3 mt-5" />
          </div>
          <div className="px-4 md:px-6">
            <h2 className="text-sm font-semibold">{t('navigation')}</h2>
            <ul className="mt-2">
              {navegacion.map((item) => (
                <li key={item.href}><Link href={item.href} className={enlace}>{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="px-4 md:px-6">
            <h2 className="text-sm font-semibold">{t('social')}</h2>
            <ul className="mt-2">
              <li><a href={contactConfig.socials.github} target="_blank" rel="noopener noreferrer" className={enlace}><Github className="size-4" />GitHub</a></li>
              <li><a href={contactConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" className={enlace}><Linkedin className="size-4" />LinkedIn</a></li>
              <li><a href={enlaceCorreo()} className={enlace}><Mail className="size-4" />{contactConfig.email}</a></li>
            </ul>
          </div>
        </div>
        <p className="mx-4 mt-12 border-t border-background/15 pt-6 text-sm text-background/60 md:mx-6">{t('copyright', { year: anio })}</p>
      </div>
    </footer>
  );
}
