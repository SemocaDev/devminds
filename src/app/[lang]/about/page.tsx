import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Github, Linkedin } from 'lucide-react';
import { getTeamMembers } from '@/db/queries/team';
import MarcoPagina from '@/app/components/pagina/MarcoPagina';
import EncabezadoPagina from '@/app/components/pagina/EncabezadoPagina';
import CampoPuntos from '@/app/components/reticula/CampoPuntos';
import DivisorSeccion, { Cruz } from '@/app/components/reticula/DivisorSeccion';
import Reticula from '@/app/components/reticula/Reticula';
import Cierre from '@/app/components/sections/Cierre/Cierre';

type Props = { params: Promise<{ lang: string }> };

export const revalidate = 3600;

const PRINCIPIOS = ['directo', 'precio', 'avances', 'codigo'] as const;
const rotulo = 'text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground';
const enlace = 'inline-flex min-h-11 items-center gap-2 text-[15px] font-medium transition-colors hover:text-primary';

/** Hoja 04: la persona detrás del estudio, cómo se trabaja y con qué. */
export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const [miembros, t, tCartela, tNav] = await Promise.all([
    getTeamMembers(lang),
    getTranslations('Nosotros'),
    getTranslations('Cartela'),
    getTranslations('Navbar'),
  ]);
  const fundador = miembros.find((m) => m.hierarchy === 'founder') ?? miembros[0];
  const historia = t.raw('historia') as string[];

  const persona = fundador && {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fundador.name,
    jobTitle: t('cargo'),
    image: fundador.photo ?? undefined,
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universidad Surcolombiana' },
    worksFor: { '@id': 'https://www.devminds.online/#organization' },
    sameAs: [fundador.linkedin, fundador.github].filter(Boolean),
  };

  return (
    <MarcoPagina>
      {persona && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(persona) }} />}
      <EncabezadoPagina
        titulo={t('titulo')}
        bajada={t('bajada')}
        hoja="04"
        seccion={tNav('about')}
        migas={[{ nombre: tCartela('inicio'), ruta: '' }, { nombre: tNav('about'), ruta: '/about' }]}
      />

      {/* El fundador: foto, historia y datos */}
      <div className="contenedor-reticula relative z-[2]">
        <div className="grid md:grid-cols-4">
          <div className="relative aspect-[4/5] bg-secondary md:aspect-auto md:min-h-[420px]">
            {fundador?.photo ? (
              <Image src={fundador.photo} alt={fundador.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
            ) : (
              <CampoPuntos />
            )}
          </div>
          <div className="px-4 py-10 md:col-span-2 md:px-6 md:py-12">
            {fundador && <h2 className="font-display text-3xl font-bold tracking-[-0.02em] md:text-[2.25rem]">{fundador.name}</h2>}
            <p className="mt-1 text-[15px] font-medium text-primary">{t('rol')}</p>
            <div className="mt-6 max-w-[62ch] space-y-4 text-[17px] leading-relaxed text-foreground/85">
              {historia.map((parrafo) => <p key={parrafo.slice(0, 24)}>{parrafo}</p>)}
            </div>
          </div>
          <div className="bg-secondary px-4 py-10 md:px-6 md:py-12">
            <dl className="space-y-5">
              <div><dt className={rotulo}>{t('datos.base')}</dt><dd className="mt-1 text-[15px] font-medium">{t('datos.baseValor')}</dd></div>
              <div><dt className={rotulo}>{t('datos.formacion')}</dt><dd className="mt-1 text-[15px] font-medium">{t('datos.formacionValor')}</dd></div>
            </dl>
            {(fundador?.linkedin || fundador?.github) && (
              <div className="mt-6">
                <p className={rotulo}>{t('datos.enlaces')}</p>
                <ul className="mt-1">
                  {fundador.linkedin && <li><a href={fundador.linkedin} target="_blank" rel="noopener noreferrer" className={enlace}><Linkedin className="size-4" />LinkedIn</a></li>}
                  {fundador.github && <li><a href={fundador.github} target="_blank" rel="noopener noreferrer" className={enlace}><Github className="size-4" />GitHub</a></li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cómo trabajamos: los principios en banda carbón */}
      <section className="banda-carbon relative z-[2]">
        <Reticula />
        <div className="contenedor-reticula relative z-[2]">
          <div className="grid md:grid-cols-4">
            <h2 className="px-4 pb-10 pt-16 font-display text-3xl font-bold tracking-[-0.02em] md:col-span-2 md:px-6 md:pb-14 md:pt-24 md:text-[2.5rem]">{t('principios.titulo')}</h2>
            <div className="relative h-[88px] border-t border-guide md:col-span-2 md:h-auto md:border-0">
              <CampoPuntos />
            </div>
          </div>
          <ul className="grid gap-y-10 pb-16 md:grid-cols-4 md:pb-24">
            {PRINCIPIOS.map((clave, i) => (
              <li key={clave} className="relative border-t border-guide px-4 pt-6 md:px-6">
                <Cruz className="left-0 top-0" />
                <Cruz className={i === PRINCIPIOS.length - 1 ? 'left-full top-0 min-[1360px]:hidden' : 'left-full top-0 md:hidden'} />
                <span aria-hidden className="font-doto text-3xl font-black leading-none text-primary">+</span>
                <h3 className="mt-4 font-display text-xl font-bold tracking-[-0.015em]">{t(`principios.${clave}.titulo`)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`principios.${clave}.texto`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Con qué trabajamos */}
      <div className="contenedor-reticula relative z-[2]">
        <div className="grid gap-y-3 py-10 md:grid-cols-4 md:py-12">
          <h2 className="px-4 font-display text-xl font-bold tracking-[-0.015em] md:px-6">{t('tecnologias.titulo')}</h2>
          <p className="px-4 text-[17px] leading-relaxed text-muted-foreground md:col-span-3 md:px-6">{t('tecnologias.lista')}</p>
        </div>
      </div>
      <DivisorSeccion />
      <Cierre />
    </MarcoPagina>
  );
}
