import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';

type Props = {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'Metadata' });

  const title = t('portfolio.title');
  const description = t('portfolio.description');
  const keywords = t('portfolio.keywords');

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://www.devminds.online/${lang}/portfolio`,
      siteName: 'DevMinds',
      locale: lang === 'es' ? 'es_CO' : lang === 'en' ? 'en_US' : 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://www.devminds.online/${lang}/portfolio`,
      languages: {
        'x-default': 'https://www.devminds.online/es/portfolio',
        'es': 'https://www.devminds.online/es/portfolio',
        'en': 'https://www.devminds.online/en/portfolio',
        'ja': 'https://www.devminds.online/ja/portfolio',
      },
    },
  };
}

export default async function PortfolioLayout({ params, children }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema('/portfolio', lang))
        }}
      />
      {children}
    </>
  );
}
