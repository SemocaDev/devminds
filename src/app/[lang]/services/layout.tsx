import { Metadata } from 'next';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const metadata = {
    es: {
      title: "Servicios de Desarrollo Web - DevMinds | Next.js, React, WordPress en Neiva",
      description: "Servicios de desarrollo web profesional en Neiva, Colombia. Desarrollo web moderno con Next.js y React, software personalizado, WordPress y consultoría técnica. Agencia de software en Huila.",
      keywords: "servicios desarrollo web neiva, next.js neiva, react developer neiva, wordpress neiva, software a medida colombia, consultoría técnica neiva"
    },
    en: {
      title: "Web Development Services - DevMinds | Next.js, React, WordPress in Neiva",
      description: "Professional web development services in Neiva, Colombia. Modern web development with Next.js and React, custom software, WordPress and technical consulting.",
      keywords: "web development services neiva, next.js neiva, react developer neiva, custom software colombia"
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
      url: `https://devminds.online/${lang}/services`,
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
      canonical: `https://devminds.online/${lang}/services`,
      languages: {
        'es': 'https://devminds.online/es/services',
        'en': 'https://devminds.online/en/services',
      },
    },
  };
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
