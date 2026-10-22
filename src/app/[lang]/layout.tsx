// src/app/[lang]/layout.tsx - Versión mejorada con SEO y Temas
import { Geist, Outfit, Doto, Geist_Mono, Instrument_Serif } from "next/font/google";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { generateOrganizationSchema, generateLocalBusinessSchema } from "@/lib/schemas/organization-schema";
import "@/styles/globals.css";
import "@/styles/movimiento.css";
import RevelarAlScroll from "@/app/components/movimiento/RevelarAlScroll";
import { instalarRevelado } from "@/lib/revelado";

// Font configurations
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  // "optional": si la fuente no está lista casi de inmediato, se queda con el
  // fallback y no hace swap después — evita el salto de ancho de texto en el
  // título del Hero justo mientras el typewriter está escribiendo.
  display: "optional",
});

const doto = Doto({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-doto",
  display: "swap",
});

const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["600"], variable: "--font-geist-mono", display: "swap", preload: false });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["italic"], variable: "--font-instrument", display: "swap", preload: false });

import { locales, Locale } from '@/config/i18n-config';
import { imagenOg } from '@/lib/og';

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string; }>;
};

// Generar rutas estáticas para todos los idiomas
export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

// Función para generar metadatos dinámicos según el idioma usando traducciones
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'Metadata' });

  const title = t('home.title');
  const description = t('home.description');
  const keywords = t('home.keywords');

  const og = imagenOg(lang);

  return {
    title,
    description,
    keywords,

    // Iconos - PWA optimizado
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },

    // Metadatos básicos
    authors: [{ name: "DevMinds Team" }],
    creator: "DevMinds",
    publisher: "DevMinds",

    // Open Graph para redes sociales
    openGraph: {
      type: 'website',
      locale: lang === 'es' ? 'es_CO' : lang === 'en' ? 'en_US' : 'ja_JP',
      url: `https://www.devminds.online/${lang}`,
      title,
      description,
      siteName: 'DevMinds',
      images: [og],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@devminds',
      images: [og.url],
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

    // Canonical URL - Usando www como canónica
    alternates: {
      canonical: `https://www.devminds.online/${lang}`,
      languages: {
        'x-default': 'https://www.devminds.online/es',
        'es': 'https://www.devminds.online/es',
        'en': 'https://www.devminds.online/en',
        'ja': 'https://www.devminds.online/ja',
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

// Habilita los estados ocultos del movimiento (html.mov) y la entrada inicial (html.mov-entrada), salvo con
// "reducir movimiento". Si el script de revelado (fin de <body>) no corre en 3 s, quita html.mov: todo se ve.
const SCRIPT_MOVIMIENTO = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('mov','mov-entrada');setTimeout(function(){if(!window.__movListo)d.classList.remove('mov','mov-entrada')},3000)}catch(e){}})();`;

export default async function RootLayout(props: Props) {
  const { lang } = await props.params;

  // Habilitar renderizado estático para este locale
  setRequestLocale(lang);

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
    // suppressHydrationWarning: el script de movimiento añade clases a <html> antes de hidratar.
    <html lang={lang} suppressHydrationWarning className={`${geist.variable} ${outfit.variable} ${doto.variable} ${geistMono.variable} ${instrument.variable} overflow-x-hidden`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_MOVIMIENTO }} />
        <meta name="theme-color" content="#f8fafd" />
        <meta name="msapplication-TileColor" content="#f8fafd" />
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
      <body className="min-h-screen flex flex-col font-sans antialiased">
          <NextIntlClientProvider locale={lang} messages={messages}>
            <RevelarAlScroll />
            {props.children}
          </NextIntlClientProvider>
          {/* Revelado al hacer scroll: corre al terminar de leer el HTML, sin esperar a React. */}
          <script dangerouslySetInnerHTML={{ __html: `(${instalarRevelado.toString()})();` }} />
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                toast: 'font-sans',
                title: 'font-semibold',
                description: 'text-sm opacity-90',
              },
            }}
          />
      </body>
    </html>
  );
}