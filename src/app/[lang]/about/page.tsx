import { setRequestLocale } from 'next-intl/server';
import { getTeamMembers } from '@/db/queries/team';
import AboutClient from './AboutClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export const revalidate = 3600;

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const members = await getTeamMembers(lang);

  return <AboutClient members={members} />;
}
