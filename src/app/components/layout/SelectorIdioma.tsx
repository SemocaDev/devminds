'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { locales } from '@/config/i18n-config';
import { rutaEnIdioma } from '@/lib/rutas';
import { cn } from '@/lib/utils';

type Props = { className?: string; tono?: 'claro' | 'oscuro' };

/** Enlaces ES · EN · JA a la misma página en otro idioma. */
export default function SelectorIdioma({ className, tono = 'claro' }: Props) {
  const t = useTranslations('Navbar');
  const pathname = usePathname();
  const { lang } = useParams<{ lang: string }>();
  return (
    <nav aria-label={t('idioma')} className={cn('flex items-center', className)}>
      {locales.map((l) => {
        const activo = l === lang;
        return (
          <Link
            key={l}
            href={rutaEnIdioma(pathname, l)}
            hrefLang={l}
            aria-current={activo ? 'true' : undefined}
            className={cn(
              'inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-xs font-semibold uppercase transition-colors',
              tono === 'claro'
                ? activo ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                : activo ? 'text-background' : 'text-background/60 hover:text-background'
            )}
          >
            {l}
          </Link>
        );
      })}
    </nav>
  );
}
