/**
 * Google Analytics 4 - Tracking y eventos
 * Documentación: https://developers.google.com/analytics/devguides/collection/gtagjs
 */

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Verificar si Analytics está habilitado
export const isAnalyticsEnabled = (): boolean => {
  return !!GA_TRACKING_ID && typeof window !== 'undefined';
};

/**
 * Registrar visualización de página
 * Se ejecuta automáticamente en cada cambio de ruta
 */
export const pageview = (url: string) => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

/**
 * Registrar evento personalizado
 * Ejemplos: clicks en botones, envío de formularios, etc.
 */
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

/**
 * Eventos predefinidos comunes
 */
export const trackContact = () => {
  event({
    action: 'click',
    category: 'Contact',
    label: 'Contact Button Clicked',
  });
};

export const trackProjectView = (projectName: string) => {
  event({
    action: 'view',
    category: 'Projects',
    label: projectName,
  });
};

export const trackServiceView = (serviceName: string) => {
  event({
    action: 'view',
    category: 'Services',
    label: serviceName,
  });
};

// Tipos para window.gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}
