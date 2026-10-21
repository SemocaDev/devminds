import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import CampoPuntos from '@/app/components/reticula/CampoPuntos';
import DivisorSeccion, { Cruz } from '@/app/components/reticula/DivisorSeccion';
import Rieles from '@/app/components/reticula/Rieles';
import type { Miga } from '@/lib/hojas';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';

type Props = {
  titulo: string;
  bajada?: ReactNode;
  /** Línea pequeña sobre el título (p. ej. "Sistema a medida · 2026"). */
  meta?: string;
  /** Número de hoja del plano: "02", "03.1", "404"… */
  hoja: string;
  seccion: string;
  /** Ruta completa, de Inicio a la página actual. La penúltima es la página madre. */
  migas: Miga[];
};

const rotulo = 'text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground';

/**
 * Encabezado de las páginas internas: título en las columnas 1–3 y la cartela de plano en la 4
 * (volver, ruta, puntos y número de hoja). En móvil la cartela se vuelve una franja bajo la navbar.
 * Emite también el BreadcrumbList con la misma ruta.
 */
export default async function EncabezadoPagina({ titulo, bajada, meta, hoja, seccion, migas }: Props) {
  const lang = await getLocale();
  const t = await getTranslations('Cartela');
  const madre = migas.at(-2) ?? migas[0];
  const href = (m: Miga) => `/${lang}${m.ruta}`;

  const volver = (
    <Link href={href(madre)} aria-label={t('volverA', { pagina: madre.nombre })} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold transition-colors hover:text-primary">
      <ArrowLeft className="size-4" />{madre.nombre}
    </Link>
  );
  // En Doto el punto se lee como "+": se dibuja como un cuadrito para que "03.2" no parezca "03+2".
  const numero = (tamano: string) => (
    <span className={`font-doto font-black leading-none tracking-[-0.03em] text-primary ${tamano}`}>
      <span aria-hidden>
        {hoja.split('.').map((parte, i) => (
          <span key={i}>{i > 0 && <span className="mx-[0.06em] inline-block size-[0.14em] bg-current" />}{parte}</span>
        ))}
      </span>
      <span className="sr-only">{hoja}</span>
    </span>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(lang, migas)) }} />
      <section className="relative">
        <Rieles modo="pagina" />
        <DivisorSeccion className="absolute inset-x-0 top-16 md:top-[72px]" />
        <div className="contenedor-reticula relative z-[2] pt-16 md:pt-[72px]">
          <div className="grid md:grid-cols-4">
            {/* Móvil: franja de la cartela y puntos */}
            <div className="grid grid-cols-[1fr_auto] border-b border-guide md:hidden">
              <div className="border-r border-guide px-4">{volver}</div>
              <div className="flex items-center gap-2 px-4"><span className={rotulo}>{t('hoja')}</span>{numero('text-2xl')}</div>
            </div>
            <div className="relative h-14 border-b border-guide md:hidden">
              <CampoPuntos />
              <Cruz className="left-0 top-full" />
              <Cruz className="left-full top-full" />
            </div>

            <div className="px-4 pb-10 pt-8 md:col-span-3 md:flex md:min-h-[320px] md:flex-col md:justify-end md:px-6 md:pb-12 md:pt-16">
              {meta && <p className="mb-3 text-sm font-medium text-muted-foreground">{meta}</p>}
              <h1 className="entrada max-w-[18ch] font-display text-[2.125rem] font-bold leading-[1.04] tracking-[-0.025em] [overflow-wrap:anywhere] sm:text-5xl lg:text-[3.25rem]">
                {titulo}
              </h1>
              {bajada && <div className="entrada mt-5 max-w-[56ch] text-[17px] leading-relaxed text-muted-foreground md:text-lg" style={{ '--i': 1 } as CSSProperties}>{bajada}</div>}
            </div>

            {/* Escritorio: la cartela */}
            <aside className="hidden md:flex md:flex-col">
              <div className="relative border-b border-guide px-6">{volver}<Cruz className="left-0 top-full" /></div>
              <nav aria-label={t('ruta')} className="border-b border-guide px-6 py-3 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
                <ol className="flex flex-wrap items-center">
                  {migas.map((m, i) => (
                    <li key={m.ruta + m.nombre} className="flex items-center">
                      {i > 0 && <span aria-hidden className="px-1.5 text-primary">/</span>}
                      {i === migas.length - 1 ? (
                        <span aria-current="page" className="font-semibold text-foreground">{m.nombre}</span>
                      ) : (
                        <Link href={href(m)} className="transition-colors hover:text-foreground">{m.nombre}</Link>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="relative min-h-[96px] flex-1"><CampoPuntos /></div>
              <div className="relative flex items-end justify-between gap-3 border-t border-guide px-6 pb-4 pt-3">
                <Cruz className="left-0 top-0" />
                <div>
                  <span className={`block ${rotulo}`}>{t('hoja')}</span>
                  {numero('text-[2.5rem]')}
                </div>
                <span className={`${rotulo} text-right`}>{seccion}</span>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <DivisorSeccion />
    </>
  );
}
