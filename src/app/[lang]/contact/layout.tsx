import { Metadata } from 'next';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const metadata = {
    es: {
      title: "Contacto - DevMinds | Solicita tu Proyecto Web en Neiva, Colombia",
      description: "Contacta a DevMinds para tu proyecto de desarrollo web en Neiva, Huila. Cotización gratis para aplicaciones web, software personalizado y consultoría técnica. Agencia de desarrollo en Colombia.",
      keywords: "contacto devminds, cotización desarrollo web neiva, presupuesto software neiva, agencia desarrollo neiva contacto, desarrollo web colombia"
    },
    en: {
      title: "Contact - DevMinds | Request Your Web Project in Neiva, Colombia",
      description: "Contact DevMinds for your web development project in Neiva, Huila. Free quote for web applications, custom software and technical consulting.",
      keywords: "contact devminds, web development quote neiva, software budget neiva"
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
      url: `https://devminds.online/${lang}/contact`,
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
      canonical: `https://devminds.online/${lang}/contact`,
      languages: {
        'es': 'https://devminds.online/es/contact',
        'en': 'https://devminds.online/en/contact',
      },
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
