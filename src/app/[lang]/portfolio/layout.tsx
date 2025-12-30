import { Metadata } from 'next';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const metadata = {
    es: {
      title: "Portafolio de Proyectos Web - DevMinds | Neiva, Huila",
      description: "Explora nuestro portafolio de proyectos de desarrollo web en Neiva, Colombia. Aplicaciones web modernas con Next.js, React y TypeScript. Ejemplos de software personalizado y sitios web profesionales.",
      keywords: "portafolio desarrollo web neiva, proyectos web colombia, ejemplos desarrollo next.js, trabajos devminds, portfolio neiva"
    },
    en: {
      title: "Web Projects Portfolio - DevMinds | Neiva, Huila",
      description: "Explore our web development projects portfolio in Neiva, Colombia. Modern web applications with Next.js, React and TypeScript. Custom software and professional websites examples.",
      keywords: "web development portfolio neiva, web projects colombia, nextjs examples, devminds work"
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
      url: `https://devminds.online/${lang}/portfolio`,
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
      canonical: `https://devminds.online/${lang}/portfolio`,
      languages: {
        'es': 'https://devminds.online/es/portfolio',
        'en': 'https://devminds.online/en/portfolio',
      },
    },
  };
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
