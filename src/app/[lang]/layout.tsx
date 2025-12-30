// src/app/[lang]/layout.tsx - Versión mejorada con SEO y Temas
import { Roboto, Doto } from "next/font/google";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import ClientThemeWrapper from "@/app/components/ClientThemeWrapper";
import { Toaster } from "@/components/ui/sonner";
import { generateOrganizationSchema, generateLocalBusinessSchema } from "@/lib/schemas/organization-schema";
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

    // Iconos - PWA optimizado
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
        { url: '/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
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
    <html lang={lang} className={`${roboto.variable} ${doto.variable} overflow-x-hidden`}>
      <head>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FFFFFF" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0A0A0A" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="geo.region" content="CO" />
        <meta name="geo.placename" content="Colombia" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />

        {/* JSON-LD Schemas para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema(lang))
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLocalBusinessSchema(lang))
          }}
        />

        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col font-roboto antialiased overflow-x-hidden">
        <ClientThemeWrapper>
          <NextIntlClientProvider locale={lang} messages={messages}>
            {props.children}
          </NextIntlClientProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                toast: 'font-mono',
                title: 'font-semibold',
                description: 'text-sm opacity-90',
              },
            }}
          />
        </ClientThemeWrapper>
      </body>
    </html>
  );
}