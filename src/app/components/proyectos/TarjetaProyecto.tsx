import Image from 'next/image';
import Link from 'next/link';
import type { ProjectWithTranslation } from '@/db/queries/projects';
import { lineaMeta } from '@/lib/proyectos';
import { cn } from '@/lib/utils';

type Props = {
  proyecto: ProjectWithTranslation;
  href: string;
  /** Nombre del tipo de proyecto ya traducido, o null si no tiene. */
  tipo: string | null;
  /** El destacado ocupa dos columnas y usa una imagen más panorámica. */
  destacado?: boolean;
};

/** Tarjeta de proyecto sobre la retícula: captura, tipo · cliente · año, título y descripción. */
export default function TarjetaProyecto({ proyecto: p, href, tipo, destacado = false }: Props) {
  return (
    <Link href={href} className="group block">
      <div className={cn('relative overflow-hidden rounded-xl border border-border bg-secondary', destacado ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
        {p.images?.[0] && (
          <Image
            src={p.images[0]}
            alt={p.title}
            fill
            sizes={destacado ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 25vw'}
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>
      <p className="mt-4 text-[13px] font-medium text-muted-foreground">{lineaMeta([tipo, p.client, p.year])}</p>
      <h3 className={cn('mt-1 font-display font-bold tracking-[-0.015em] text-foreground', destacado ? 'text-2xl' : 'text-xl')}>{p.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{p.description}</p>
    </Link>
  );
}
