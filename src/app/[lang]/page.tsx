import { setRequestLocale } from 'next-intl/server';
import { getFeaturedProjects } from '@/db/queries/projects';
import HomeClient from './HomeClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export const revalidate = 3600;

export default async function Home({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const featuredProjects = await getFeaturedProjects(lang);

  return <HomeClient featuredProjects={featuredProjects} />;
}
