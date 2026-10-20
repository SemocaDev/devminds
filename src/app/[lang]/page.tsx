import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getFeaturedProjects } from '@/db/queries/projects';
import { getTeamMembers } from '@/db/queries/team';
import { PREGUNTAS } from '@/config/preguntas';
import { elegirFundador } from '@/lib/equipo';
import { generateFAQSchema } from '@/lib/schemas/faq-schema';
import HomeClient from './HomeClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export const revalidate = 3600;

export default async function Home({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const [featuredProjects, miembros, t] = await Promise.all([
    getFeaturedProjects(lang),
    getTeamMembers(lang),
    getTranslations({ locale: lang, namespace: 'Home.preguntas' }),
  ]);

  const faqSchema = generateFAQSchema(
    PREGUNTAS.map((id) => ({ question: t(`items.${id}.pregunta`), answer: t(`items.${id}.respuesta`) }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <HomeClient featuredProjects={featuredProjects} fundador={elegirFundador(miembros)} />
    </>
  );
}
