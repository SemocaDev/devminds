import { IEmailService } from '@/core/domain/contact/ports/IEmailService';
import { ResendEmailAdapter } from './ResendEmailAdapter';
import { MockEmailAdapter } from './MockEmailAdapter';

/**
 * Email Service Provider type
 */
export type EmailProvider = 'resend' | 'mock';

/**
 * Factory para crear instancias de servicios de email
 * Patrón Factory para desacoplar la creación de adaptadores
 *
 * Permite cambiar fácilmente el proveedor de email mediante configuración
 */
export class EmailServiceFactory {
  /**
   * Crea una instancia del servicio de email basado en el proveedor especificado
   */
  static create(provider?: EmailProvider): IEmailService {
    const emailProvider = provider || (process.env.EMAIL_PROVIDER as EmailProvider) || 'mock';

    switch (emailProvider) {
      case 'resend':
        try {
          return new ResendEmailAdapter();
        } catch (error) {
          console.warn(
            '[EmailServiceFactory] Failed to create Resend adapter, falling back to Mock:',
            error instanceof Error ? error.message : error
          );
          return new MockEmailAdapter();
        }

      case 'mock':
        return new MockEmailAdapter();

      default:
        console.warn(
          `[EmailServiceFactory] Unknown provider "${emailProvider}", using Mock adapter`
        );
        return new MockEmailAdapter();
    }
  }

  /**
   * Crea el servicio de email con configuración personalizada
   */
  static createWithConfig(config: {
    provider: EmailProvider;
    apiKey?: string;
    fromEmail?: string;
    toEmail?: string;
  }): IEmailService {
    switch (config.provider) {
      case 'resend':
        return new ResendEmailAdapter(
          config.apiKey,
          config.fromEmail,
          config.toEmail
        );

      case 'mock':
        return new MockEmailAdapter();

      default:
        throw new Error(`Unknown email provider: ${config.provider}`);
    }
  }
}
