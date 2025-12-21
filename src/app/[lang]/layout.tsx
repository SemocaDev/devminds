// src/app/[lang]/layout.tsx - Versión mejorada con SEO y Temas
import { Roboto, Doto } from "next/font/google";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import ClientThemeWrapper from "@/app/components/ClientThemeWrapper";
import "@/styles/globals.css";

// Font configurations
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const doto = Doto({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
  variable: "--font-doto",
  display: "swap",
});

import { locales, Locale } from '@/config/i18n-config';

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string; }>;
};

// Función para generar metadatos dinámicos según el idioma
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  
  // Metadatos por idioma
  const metadata = {
    es: {
      title: "DevMinds - Desarrollo Web y Software Personalizado",
      description: "Creamos soluciones digitales eficientes y profesionales. Desarrollo web, software personalizado y consultoría técnica. Código limpio y escalable para empresas.",
      keywords: "desarrollo web, software personalizado, Next.js, React, consultoría técnica, desarrollo colombia, soluciones empresariales"
    },
    en: {
      title: "DevMinds - Professional Web Development & Custom Software",
      description: "We create efficient and professional digital solutions. Web development, custom software and technical consulting. Clean and scalable code for businesses.",
      keywords: "web development, custom software, Next.js, React, technical consulting, development colombia, business solutions"
    },
    ja: {
      title: "DevMinds - プロフェッショナルウェブ開発とカスタムソフトウェア",
      description: "効率的でプロフェッショナルなデジタルソリューションを作成します。ウェブ開発、カスタムソフトウェア、技術コンサルティング。",
      keywords: "ウェブ開発, カスタムソフトウェア, Next.js, React, 技術コンサルティング, ビジネスソリューション"
    }
  };

  const currentLang = lang as keyof typeof metadata;
  const meta = metadata[currentLang] || metadata.es;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,

    // Iconos
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
    },

    // Metadatos básicos
    authors: [{ name: "DevMinds Team" }],
    creator: "DevMinds",
    publisher: "DevMinds",
    
    // Open Graph para redes sociales
    openGraph: {
      type: 'website',
      locale: lang,
      url: `https://devminds.online/${lang}`,
      title: meta.title,
      description: meta.description,
      siteName: 'DevMinds',
      images: [
        {
          url: 'https://devminds.online/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'DevMinds - Soluciones Digitales Profesionales',
        }
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      creator: '@devminds',
      images: ['https://devminds.online/og-image.jpg'],
    },
    
    // Robots y indexación
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Canonical URL
    alternates: {
      canonical: `https://devminds.online/${lang}`,
      languages: {
        'es': 'https://devminds.online/es',
        'en': 'https://devminds.online/en',
        'ja': 'https://devminds.online/ja',
      },
    },
    
    // Metadatos adicionales
    category: 'technology',
    classification: 'Professional Web Development Services',
    
    // Para aplicaciones web progresivas (PWA)
    manifest: '/manifest.json',
    
    // Verificación de motores de búsqueda (agregar cuando tengas las keys)
    // verification: {
    //   google: 'tu-codigo-de-verificacion-google',
    //   yandex: 'tu-codigo-de-verificacion-yandex',
    //   yahoo: 'tu-codigo-de-verificacion-yahoo',
    // },
  };
}

export default async function RootLayout(props: Props) {
  const { lang } = await props.params;

  if (!locales.includes(lang as Locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../../messages/${lang}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={lang} className={`${roboto.variable} ${doto.variable}`}>
      <head>
        {/* Colores del tema para navegadores móviles - Minimalista */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FFFFFF" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0A0A0A" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />

        {/* Para mejor SEO local */}
        <meta name="geo.region" content="CO" />
        <meta name="geo.placename" content="Colombia" />

        {/* Structured Data (JSON-LD) para SEO avanzado */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "DevMinds",
              "url": "https://devminds.online",
              "description": "Creamos soluciones digitales profesionales y eficientes para empresas",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "hello@devminds.com",
                "contactType": "customer service"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "CO"
              },
              "offers": {
                "@type": "Service",
                "serviceType": "Professional Web Development and Custom Software"
              }
            })
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-roboto antialiased">
        <ClientThemeWrapper>
          <NextIntlClientProvider locale={lang} messages={messages}>
            {props.children}
          </NextIntlClientProvider>
        </ClientThemeWrapper>
      </body>
    </html>
  );
}