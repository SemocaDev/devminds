import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { generateServiceSchema } from '@/lib/schemas/service-schema';
import { metadataDePagina } from '@/lib/metadata';

type Props = {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'Metadata' });
  return metadataDePagina({ lang, ruta: '/services', title: t('services.title'), description: t('services.description') });
}

export default async function ServicesLayout({ params, children }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateServiceSchema(lang)) }} />
      {children}
    </>
  );
}
