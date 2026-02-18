import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { generateServiceSchema } from '@/lib/schemas/service-schema';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';

type Props = {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'Metadata' });

  const title = t('services.title');
  const description = t('services.description');
  const keywords = t('services.keywords');

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://www.devminds.online/${lang}/services`,
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
      canonical: `https://www.devminds.online/${lang}/services`,
      languages: {
        'x-default': 'https://www.devminds.online/es/services',
        'es': 'https://www.devminds.online/es/services',
        'en': 'https://www.devminds.online/en/services',
        'ja': 'https://www.devminds.online/ja/services',
      },
    },
  };
}

export default async function ServicesLayout({ params, children }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  return (
    <>
      {/* JSON-LD Schemas para SEO de Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateServiceSchema(lang))
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema('/services', lang))
        }}
      />
      {children}
    </>
  );
}
