import { setRequestLocale } from 'next-intl/server';
import { getProjects, getCategories } from '@/db/queries/projects';
import PortfolioClient from './PortfolioClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export const revalidate = 3600;

export default async function PortfolioPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const [projects, categories] = await Promise.all([
    getProjects(lang),
    getCategories(lang),
  ]);

  return <PortfolioClient projects={projects} categories={categories} />;
}
