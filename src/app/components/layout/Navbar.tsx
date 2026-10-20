'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Wordmark from '@/app/components/marca/Wordmark';
import SelectorIdioma from '@/app/components/layout/SelectorIdioma';
import { enlaceWhatsApp } from '@/lib/enlaces';
import { cn } from '@/lib/utils';

type ItemNav = { label: string; href: string };

const Navbar = () => {
  const t = useTranslations('Navbar');
  const tHome = useTranslations('Home');
  const pathname = usePathname();
  const { lang } = useParams<{ lang: string }>();
  const [conFondo, setConFondo] = useState(false);
  const [oculta, setOculta] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const ultimoY = useRef(0);

  const esHome = pathname === `/${lang}`;
  const items: ItemNav[] = esHome
    ? [
        { label: t('services'), href: '#services' },
        { label: t('projects'), href: '#projects' },
        { label: t('process'), href: '#process' },
        { label: t('faq'), href: '#faq' },
      ]
    : [
        { label: t('home'), href: `/${lang}` },
        { label: t('services'), href: `/${lang}/services` },
        { label: t('portfolio'), href: `/${lang}/portfolio` },
        { label: t('about'), href: `/${lang}/about` },
        { label: t('contact'), href: `/${lang}/contact` },
      ];

  useEffect(() => {
    let pendiente = false;
    const alDesplazar = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setConFondo(y > 24);
        setOculta(y > ultimoY.current && y > 120);
        ultimoY.current = y;
        pendiente = false;
      });
    };
    window.addEventListener('scroll', alDesplazar, { passive: true });
    return () => window.removeEventListener('scroll', alDesplazar);
  }, []);

  const whatsapp = enlaceWhatsApp(tHome('whatsappMensaje'));

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[transform,background-color,border-color] duration-300 ease-out',
        oculta && !abierto ? '-translate-y-full' : 'translate-y-0',
        conFondo ? 'border-border bg-background/90 backdrop-blur-md' : 'border-transparent bg-transparent'
      )}
    >
      <div className="contenedor-reticula">
        <div className="grid h-16 grid-cols-[1fr_auto] items-center md:h-[72px] lg:grid-cols-4">
          <Link href={`/${lang}`} aria-label="DevMinds" className="justify-self-start px-4 text-[22px] text-foreground transition-opacity hover:opacity-75 md:px-6">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-7 px-6 lg:col-span-2 lg:flex">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-1 justify-self-end px-6 lg:flex">
            <SelectorIdioma className="hidden xl:flex" />
            <Button asChild className="bg-foreground text-background hover:bg-foreground/85">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">{t('startProject')}</a>
            </Button>
          </div>

          <div className="justify-self-end px-4 md:px-6 lg:hidden">
            <Sheet open={abierto} onOpenChange={setAbierto}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="size-11" aria-label={t('menu')}>
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-[300px] flex-col p-0">
                <SheetTitle className="sr-only">{t('menu')}</SheetTitle>
                <div className="flex h-16 items-center border-b border-border px-5">
                  <Wordmark className="text-xl" />
                </div>
                <ul className="flex flex-col p-3">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setAbierto(false)}
                        className="flex min-h-11 items-center rounded-md px-3 text-base text-foreground transition-colors hover:bg-secondary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto space-y-3 border-t border-border p-5">
                  <SelectorIdioma className="-ml-3" />
                  <Button asChild size="lg" className="w-full">
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer">{t('startProject')}</a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
