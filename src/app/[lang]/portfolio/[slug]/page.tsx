import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getProjects } from '@/db/queries/projects';
import { locales } from '@/config/i18n-config';
import MarcoPagina from '@/app/components/pagina/MarcoPagina';
import EncabezadoPagina from '@/app/components/pagina/EncabezadoPagina';
import CampoPuntos from '@/app/components/reticula/CampoPuntos';
import DivisorSeccion from '@/app/components/reticula/DivisorSeccion';
import Reticula from '@/app/components/reticula/Reticula';
import { fichaDe, galeriaDe, hojaDeProyecto, nombreCorto, proyectoYVecinos } from '@/lib/hojas';
import { metadataDePagina } from '@/lib/metadata';
import { lineaMeta } from '@/lib/proyectos';
import type { CSSProperties } from 'react';

type Props = { params: Promise<{ lang: string; slug: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  const porIdioma = await Promise.all(locales.map(async (lang) => (await getProjects(lang)).map((p) => ({ lang, slug: p.slug }))));
  return porIdioma.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = (await getProjects(lang)).find((x) => x.slug === slug);
  if (!p) return {};
  const imagen = p.images[0] ? { url: p.images[0], alt: p.title } : undefined;
  return metadataDePagina({ lang, ruta: `/portfolio/${slug}`, title: `${p.title} | DevMinds`, description: p.description, imagen });
}

/** Hoja 03.N: un proyecto con su captura, ficha, qué se hizo, galería y el siguiente proyecto. */
export default async function ProyectoPage({ params }: Props) {
  const { lang, slug } = await params;
  setRequestLocale(lang);

  const [proyectos, t, tTipos, tCartela, tNav] = await Promise.all([
    getProjects(lang),
    getTranslations('Proyecto'),
    getTranslations('Home.trabajos.tipos'),
    getTranslations('Cartela'),
    getTranslations('Navbar'),
  ]);
  const encontrado = proyectoYVecinos(proyectos, slug);
  if (!encontrado) notFound();
  const { proyecto: p, indice, siguiente } = encontrado;

  const tipo = tTipos.has(p.category) ? tTipos(p.category) : null;
  const { principal, resto } = galeriaDe(p.images);
  const relleno = (4 - (resto.length % 4)) % 4;

  return (
    <MarcoPagina>
      <EncabezadoPagina
        titulo={p.title}
        meta={lineaMeta([tipo, p.year])}
        bajada={p.description}
        hoja={hojaDeProyecto(indice)}
        seccion={tNav('projects')}
        migas={[
          { nombre: tCartela('inicio'), ruta: '' },
          { nombre: tNav('projects'), ruta: '/portfolio' },
          { nombre: nombreCorto(p.title), ruta: `/portfolio/${p.slug}` },
        ]}
      />

      {/* Captura principal a todo el ancho de la retícula */}
      <div className="contenedor-reticula relative z-[2]">
        <div className="px-4 py-8 md:px-6 md:py-12">
          <div data-mov="descubrir" className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-secondary md:aspect-[16/8]">
            {principal ? (
              <Image src={principal} alt={p.title} fill priority sizes="(max-width: 768px) 100vw, 90vw" className="object-cover object-top" />
            ) : (
              <CampoPuntos />
            )}
          </div>
        </div>
      </div>
      <DivisorSeccion />

      {/* Ficha · qué hicimos · ver sitio */}
      <div className="contenedor-reticula relative z-[2]">
        <div className="grid md:grid-cols-4">
          <dl className="space-y-4 bg-secondary px-4 py-8 md:px-6 md:py-10">
            {fichaDe(p).map((d) => (
              <div key={d.clave}>
                <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{t(`ficha.${d.clave}`)}</dt>
                <dd className="mt-1 text-[15px] font-medium">{d.valor}</dd>
              </div>
            ))}
          </dl>
          <div className="px-4 py-8 md:col-span-2 md:px-6 md:py-10">
            <h2 className="font-display text-2xl font-bold tracking-[-0.015em]">{t('queHicimos')}</h2>
            <p className="mt-4 max-w-[62ch] whitespace-pre-line text-[17px] leading-relaxed text-foreground/85">{p.fullDescription}</p>
          </div>
          <div className="flex items-end px-4 pb-10 md:px-6 md:py-10">
            {p.demo && (
              <a
                href={p.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg bg-primary px-4 py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                {t('verSitio')}<ArrowUpRight className="size-4 shrink-0" />
              </a>
            )}
          </div>
        </div>
      </div>

      {resto.length > 0 && (
        <>
          <DivisorSeccion />
          <section aria-label={t('galeria')} className="contenedor-reticula relative z-[2]">
            <ul className="grid gap-y-6 py-8 md:grid-cols-4 md:gap-y-10 md:py-12">
              {resto.map((src, i) => (
                <li key={src} className="px-4 md:px-6">
                  <div data-mov="descubrir" style={{ '--retraso': `${(i % 4) * 80}ms` } as CSSProperties} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary">
                    <Image src={src} alt={`${p.title} · ${i + 2}`} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover object-top" />
                  </div>
                </li>
              ))}
              {Array.from({ length: relleno }, (_, i) => (
                <li key={`puntos-${i}`} aria-hidden className="relative hidden md:block"><CampoPuntos /></li>
              ))}
            </ul>
          </section>
        </>
      )}

      {/* Siguiente proyecto */}
      <section data-mov="desplegar" className="banda-carbon relative z-[2]">
        <Reticula />
        <div className="contenedor-reticula relative z-[2]">
          <div className="grid md:grid-cols-4">
            <Link href={`/${lang}/portfolio/${siguiente.slug}`} className="group px-4 py-12 md:col-span-3 md:px-6 md:py-16">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('siguiente')}</span>
              <span className="mt-2 flex items-center gap-3 font-display text-3xl font-bold tracking-[-0.02em] md:text-[2.5rem]">
                {nombreCorto(siguiente.title)}
                <ArrowRight className="size-7 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </span>
            </Link>
            <div className="relative hidden md:block"><CampoPuntos /></div>
          </div>
        </div>
      </section>
    </MarcoPagina>
  );
}
