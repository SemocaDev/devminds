import { describe, expect, it, vi } from 'vitest';

// getRequestConfig solo envuelve la función: se sustituye para probar la configuración directamente.
vi.mock('next-intl/server', () => ({ getRequestConfig: (fn: unknown) => fn }));

type Config = (p: { requestLocale: Promise<string | undefined>; locale?: string }) => Promise<{ locale: string; messages: { Metadata: { home: { title: string } } } }>;

describe('configuración de idioma por petición', () => {
  it('usa el idioma de la URL (requestLocale), no el español por defecto', async () => {
    const config = (await import('./i18n')).default as unknown as Config;
    const en = await config({ requestLocale: Promise.resolve('en') });
    expect(en.locale).toBe('en');
    expect(en.messages.Metadata.home.title).toMatch(/Colombia/);
    expect((await config({ requestLocale: Promise.resolve('ja') })).locale).toBe('ja');
  });

  it('cae en español si el idioma no existe', async () => {
    const config = (await import('./i18n')).default as unknown as Config;
    expect((await config({ requestLocale: Promise.resolve('fr') })).locale).toBe('es');
    expect((await config({ requestLocale: Promise.resolve(undefined) })).locale).toBe('es');
  });
});
