import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCategories, getProjects } from '@/db/queries/projects';
import MarcoPagina from '@/app/components/pagina/MarcoPagina';
import EncabezadoPagina from '@/app/components/pagina/EncabezadoPagina';
import Cierre from '@/app/components/sections/Cierre/Cierre';
import FiltroProyectos from './FiltroProyectos';

type Props = { params: Promise<{ lang: string }> };

export const revalidate = 3600;

/** Hoja 03: todos los proyectos sobre la retícula, con filtro por tipo. */
export default async function PortfolioPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const [proyectos, categorias, t, tCartela, tNav] = await Promise.all([
    getProjects(lang),
    getCategories(lang),
    getTranslations('Portafolio'),
    getTranslations('Cartela'),
    getTranslations('Navbar'),
  ]);

  return (
    <MarcoPagina>
      <EncabezadoPagina
        titulo={t('titulo')}
        bajada={t('bajada')}
        hoja="03"
        seccion={tNav('projects')}
        migas={[{ nombre: tCartela('inicio'), ruta: '' }, { nombre: tNav('projects'), ruta: '/portfolio' }]}
      />
      <FiltroProyectos proyectos={proyectos} categorias={categorias} />
      <Cierre />
    </MarcoPagina>
  );
}
