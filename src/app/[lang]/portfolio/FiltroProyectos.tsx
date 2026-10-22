'use client';

import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import TarjetaProyecto from '@/app/components/proyectos/TarjetaProyecto';
import { Cruz } from '@/app/components/reticula/DivisorSeccion';
import type { CategoryWithTranslation, ProjectWithTranslation } from '@/db/queries/projects';
import { cn } from '@/lib/utils';

type Props = { proyectos: ProjectWithTranslation[]; categorias: CategoryWithTranslation[] };

/** Filtros como celdas de la retícula y la lista de proyectos; el primero del filtro activo va a lo ancho. */
export default function FiltroProyectos({ proyectos, categorias }: Props) {
  const t = useTranslations('Portafolio');
  const tTipos = useTranslations('Home.trabajos.tipos');
  const { lang } = useParams<{ lang: string }>();
  const [activa, setActiva] = useState<string | null>(null);
  // Fondo del filtro activo: una sola pieza que se desliza entre celdas (solo transform).
  const grupo = useRef<HTMLDivElement>(null);
  const [marca, setMarca] = useState<CSSProperties | null>(null);

  // Solo categorías con proyectos: la DB guarda también un "todos" propio y no tiene sentido un filtro vacío.
  const conProyectos = categorias.filter((c) => proyectos.some((p) => p.category === c.id));
  const filtros = [{ id: null, nombre: t('todos') }, ...conProyectos.map((c) => ({ id: c.id, nombre: c.name }))];
  const visibles = activa ? proyectos.filter((p) => p.category === activa) : proyectos;

  useLayoutEffect(() => {
    const medir = () => {
      const boton = grupo.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!boton) return;
      setMarca({ width: boton.offsetWidth, height: boton.offsetHeight, transform: `translate(${boton.offsetLeft}px, ${boton.offsetTop}px)` });
    };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [activa]);

  return (
    <>
      <div className="contenedor-reticula relative z-[2]">
        <div ref={grupo} role="group" aria-label={t('filtrar')} className="relative grid grid-cols-2 border-b border-guide md:grid-cols-4">
          {marca && (
            <span aria-hidden style={marca} className="absolute left-0 top-0 bg-foreground transition-transform duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none" />
          )}
          {filtros.map((f, i) => (
            <button
              key={f.id ?? 'todos'}
              type="button"
              aria-pressed={activa === f.id}
              onClick={() => setActiva(f.id)}
              className={cn(
                'relative z-[1] min-h-12 px-4 text-left text-sm font-medium transition-colors md:px-6',
                i % 2 === 0 && 'border-r border-guide md:border-r-0',
                i < 2 && 'border-b border-guide md:border-b-0',
                // Hasta medir la celda (primer pintado) el fondo lo pone el propio botón.
                activa === f.id ? cn('text-background', !marca && 'bg-foreground') : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              {f.nombre}
            </button>
          ))}
          <Cruz className="left-0 top-full" />
        </div>
      </div>

      <div className="contenedor-reticula relative z-[2] py-12 md:py-16">
        {visibles.length === 0 ? (
          <p className="px-4 text-[17px] text-muted-foreground md:px-6">{t('vacio')}</p>
        ) : (
          <ul className="grid gap-y-10 md:grid-cols-4 md:gap-y-12">
            {visibles.map((p, i) => (
              <li key={p.id} className={cn('px-4 md:px-6', i === 0 && 'md:col-span-2')}>
                <TarjetaProyecto
                  proyecto={p}
                  href={`/${lang}/portfolio/${p.slug}`}
                  tipo={tTipos.has(p.category) ? tTipos(p.category) : null}
                  destacado={i === 0}
                  retraso={(i % 3) * 80}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
