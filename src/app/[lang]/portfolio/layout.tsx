import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { metadataDePagina } from '@/lib/metadata';

type Props = {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'Metadata' });
  return metadataDePagina({ lang, ruta: '/portfolio', title: t('portfolio.title'), description: t('portfolio.description') });
}

export default async function PortfolioLayout({ params, children }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  return children;
}
