import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import MarcoPagina from '@/app/components/pagina/MarcoPagina';
import EncabezadoPagina from '@/app/components/pagina/EncabezadoPagina';
import DivisorSeccion from '@/app/components/reticula/DivisorSeccion';
import Process from '@/app/components/sections/Process/Process';
import FAQ from '@/app/components/sections/FAQ/FAQ';
import Cierre from '@/app/components/sections/Cierre/Cierre';
import { ESCALONES } from '@/config/escalones';
import { enlaceWhatsApp } from '@/lib/enlaces';
import { cn } from '@/lib/utils';

type Props = { params: Promise<{ lang: string }> };

const rotulo = 'text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground';

/** Hoja 02: los cuatro escalones de la home en detalle, con un WhatsApp por servicio; cierra con las bandas de la home. */
export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations('Servicios');
  const tEscalera = await getTranslations('Home.escalera');
  const tCartela = await getTranslations('Cartela');
  const tNav = await getTranslations('Navbar');

  return (
    <MarcoPagina>
      <EncabezadoPagina
        titulo={t('titulo')}
        bajada={t('bajada')}
        hoja="02"
        seccion={tNav('services')}
        migas={[{ nombre: tCartela('inicio'), ruta: '' }, { nombre: tNav('services'), ruta: '/services' }]}
      />

      {ESCALONES.map((e, i) => {
        const incluye = t.raw(`pasos.${e.clave}.incluye`) as string[];
        return (
          <section key={e.clave} id={e.clave}>
            {i > 0 && <DivisorSeccion />}
            <div className="contenedor-reticula relative z-[2]">
              <div className="grid md:grid-cols-4">
                <div className={cn('flex min-h-[180px] flex-col p-5 md:min-h-[240px] md:p-6', e.fondo)}>
                  <span className={cn('text-[13px] font-medium', e.tenue)}>{tEscalera(`pasos.${e.clave}.etiqueta`)}</span>
                  <h2 className="mt-1 font-display text-2xl font-bold tracking-[-0.015em] md:text-[1.625rem]">{tEscalera(`pasos.${e.clave}.titulo`)}</h2>
                  {tEscalera.has(`pasos.${e.clave}.tiempo`) && (
                    <span className="mt-auto pt-4 font-doto text-xl font-black tracking-[-0.03em]">{tEscalera(`pasos.${e.clave}.tiempo`)}</span>
                  )}
                </div>
                <div className="px-4 py-8 md:col-span-2 md:px-6 md:py-10">
                  <p className={rotulo}>{t('paraQuien')}</p>
                  <p className="mt-2 max-w-[52ch] text-[17px] leading-relaxed">{t(`pasos.${e.clave}.paraQuien`)}</p>
                  <p className={cn(rotulo, 'mt-6')}>{t('incluye')}</p>
                  <ul className="mt-2 space-y-1.5">
                    {incluye.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-foreground/85">
                        <span aria-hidden className="font-semibold text-primary">+</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-end px-4 pb-10 md:px-6 md:py-10">
                  <a
                    href={enlaceWhatsApp(t(`pasos.${e.clave}.whatsapp`))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex min-h-12 w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-[15px] font-semibold leading-tight transition-colors',
                      i === 0 ? 'bg-primary text-primary-foreground hover:bg-primary-hover' : 'border border-border bg-background text-foreground hover:bg-secondary'
                    )}
                  >
                    {t('quieroEsto')}<ArrowUpRight className="size-4 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <Process />
      <DivisorSeccion />
      <FAQ />
      <Cierre />
    </MarcoPagina>
  );
}
