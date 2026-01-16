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

  const title = t('about.title');
  const description = t('about.description');
  const keywords = t('about.keywords');

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://www.devminds.online/${lang}/about`,
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
      canonical: `https://www.devminds.online/${lang}/about`,
      languages: {
        'es': 'https://www.devminds.online/es/about',
        'en': 'https://www.devminds.online/en/about',
        'ja': 'https://www.devminds.online/ja/about',
      },
    },
  };
}

export default async function AboutLayout({ params, children }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema('/about', lang))
        }}
      />
      {children}
    </>
  );
}
