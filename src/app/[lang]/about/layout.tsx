import { Metadata } from 'next';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';

type Props = {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const metadata = {
    es: {
      title: "Sobre Nosotros - DevMinds | Desarrollo Web en Neiva, Colombia",
      description: "Conoce al equipo de DevMinds. Ingenieros de software especializados en desarrollo web moderno en Neiva, Huila. Next.js, React, TypeScript.",
      keywords: "equipo desarrollo web neiva, ingenieros software colombia, devminds equipo, desarrolladores neiva huila, programadores neiva"
    },
    en: {
      title: "About Us - DevMinds | Web Development in Neiva, Colombia",
      description: "Meet the DevMinds team. Software engineers specialized in modern web development in Neiva, Huila. Next.js, React, TypeScript.",
      keywords: "web development team neiva, software engineers colombia, developers neiva huila"
    }
  } as const;

  const meta = metadata[lang as keyof typeof metadata] || metadata.es;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://devminds.online/${lang}/about`,
      siteName: 'DevMinds',
      locale: lang === 'es' ? 'es_CO' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `https://devminds.online/${lang}/about`,
      languages: {
        'es': 'https://devminds.online/es/about',
        'en': 'https://devminds.online/en/about',
      },
    },
  };
}

export default async function AboutLayout({ params, children }: Props) {
  const { lang } = await params;

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
