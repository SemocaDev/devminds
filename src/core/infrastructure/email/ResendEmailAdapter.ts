import { IEmailService, EmailMetadata } from '@/core/domain/contact/ports/IEmailService';
import { ContactMessage } from '@/core/domain/contact/entities/ContactMessage';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Adaptador de Resend para el servicio de email
 * Implementa IEmailService usando la API de Resend con soporte multiidioma
 *
 * Para usar Resend:
 * 1. Instalar: pnpm add resend
 * 2. Configurar RESEND_API_KEY en .env.local
 * 3. Verificar dominio en Resend Dashboard
 */
export class ResendEmailAdapter implements IEmailService {
  private apiKey: string;
  private fromEmail: string;
  private toEmail: string;

  constructor(apiKey?: string, fromEmail?: string, toEmail?: string) {
    this.apiKey = apiKey || process.env.RESEND_API_KEY || '';
    this.fromEmail = fromEmail || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    this.toEmail = toEmail || process.env.RESEND_TO_EMAIL || 'semoca00@gmail.com';

    if (!this.apiKey) {
      throw new Error('Resend API key is required. Set RESEND_API_KEY environment variable.');
    }
  }

  async sendContactEmail(
    message: ContactMessage,
    locale?: string,
    metadata?: EmailMetadata
  ): Promise<string> {
    try {
      // Cargar traducciones
      const translations = this.loadTranslations(locale || 'es');

      // Importar dinámicamente Resend para evitar errores si no está instalado
      const { Resend } = await import('resend');
      const resend = new Resend(this.apiKey);

      const response = await resend.emails.send({
        from: this.fromEmail,
        to: this.toEmail,
        replyTo: message.email,
        subject: message.subject || translations.subject,
        html: this.buildEmailHtml(message, translations, metadata),
        text: this.buildEmailText(message, translations, metadata)
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data?.id || 'unknown';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
      throw new Error(`Resend email failed: ${errorMessage}`);
    }
  }

  /**
   * Carga las traducciones del idioma especificado
   */
  private loadTranslations(locale: string): any {
    try {
      // Leer archivo JSON usando fs (solo funciona en servidor)
      const filePath = join(process.cwd(), 'messages', `${locale}.json`);
      const fileContent = readFileSync(filePath, 'utf-8');
      const messages = JSON.parse(fileContent);
      return messages.EmailTemplate;
    } catch (error) {
      // Fallback a español si el idioma no existe
      try {
        const filePath = join(process.cwd(), 'messages', 'es.json');
        const fileContent = readFileSync(filePath, 'utf-8');
        const messages = JSON.parse(fileContent);
        return messages.EmailTemplate;
      } catch (fallbackError) {
        // Si tampoco existe español, retornar traducciones por defecto
        return {
          subject: 'Nuevo Mensaje de Contacto - DevMinds',
          header: {
            title: 'Nuevo Mensaje de Contacto',
            subtitle: 'Formulario de Contacto - DevMinds Portfolio'
          },
          fields: {
            name: 'Nombre',
            email: 'Email',
            subject: 'Asunto',
            message: 'Mensaje'
          },
          metadata: {
            title: 'Información Técnica',
            ip: 'Dirección IP',
            userAgent: 'Navegador',
            language: 'Idioma del Formulario',
            timestamp: 'Fecha y Hora'
          },
          footer: {
            followUs: 'Síguenos en',
            contact: 'Contacto Directo',
            email: 'semoca00@gmail.com',
            copyright: '© {year} DevMinds. Todos los derechos reservados.'
          },
          cta: {
            reply: 'Responder al Cliente'
          }
        };
      }
    }
  }

  /**
   * Construye el HTML del email con diseño moderno DevMinds
   */
  private buildEmailHtml(message: ContactMessage, t: any, metadata?: EmailMetadata): string {
    const currentYear = new Date().getFullYear();
    const escapedName = this.escapeHtml(message.name);
    const escapedEmail = this.escapeHtml(message.email);
    const escapedSubject = message.subject ? this.escapeHtml(message.subject) : '';
    const escapedMessage = this.escapeHtml(message.message).replace(/\n/g, '<br>');

    return `
<!DOCTYPE html>
<html lang="${metadata?.language || 'es'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header: Gradient + Branding -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b7cf5 0%, #8b5cf6 100%); padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                DevMinds
              </h1>
              <p style="color: rgba(255, 255, 255, 0.95); margin: 12px 0 0; font-size: 18px; font-weight: 600;">
                📧 ${t.header.title}
              </p>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 8px 0 0; font-size: 14px;">
                ${t.header.subtitle}
              </p>
            </td>
          </tr>

          <!-- Content: Cards -->
          <tr>
            <td style="background: #f9fafb; padding: 32px;">

              <!-- Name Card -->
              <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background: white; margin-bottom: 16px; border-radius: 8px; border-left: 4px solid #3b7cf5; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; font-weight: 600; color: #3b7cf5; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                      👤 ${t.fields.name}
                    </p>
                    <p style="margin: 0; color: #1f2937; font-size: 16px; line-height: 1.5;">
                      ${escapedName}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Email Card -->
              <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background: white; margin-bottom: 16px; border-radius: 8px; border-left: 4px solid #3b7cf5; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; font-weight: 600; color: #3b7cf5; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                      📧 ${t.fields.email}
                    </p>
                    <p style="margin: 0;">
                      <a href="mailto:${escapedEmail}" style="color: #3b7cf5; text-decoration: none; font-size: 16px; font-weight: 500;">
                        ${escapedEmail}
                      </a>
                    </p>
                  </td>
                </tr>
              </table>

              ${escapedSubject ? `
              <!-- Subject Card -->
              <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background: white; margin-bottom: 16px; border-radius: 8px; border-left: 4px solid #3b7cf5; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; font-weight: 600; color: #3b7cf5; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                      📋 ${t.fields.subject}
                    </p>
                    <p style="margin: 0; color: #1f2937; font-size: 16px; line-height: 1.5;">
                      ${escapedSubject}
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Message Card -->
              <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background: white; margin-bottom: 24px; border-radius: 8px; border-left: 4px solid #8b5cf6; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td>
                    <p style="margin: 0 0 12px; font-weight: 600; color: #8b5cf6; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                      💬 ${t.fields.message}
                    </p>
                    <p style="margin: 0; color: #1f2937; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
                      ${escapedMessage}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapedEmail}?subject=Re: ${encodeURIComponent(escapedSubject || 'Contact')}"
                       style="display: inline-block; background: linear-gradient(135deg, #3b7cf5 0%, #8b5cf6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 124, 245, 0.3);">
                      ${t.cta.reply} →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          ${metadata ? `
          <!-- Metadata Section -->
          <tr>
            <td style="background: #f3f4f6; padding: 24px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 16px; font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                ${t.metadata.title}
              </p>
              <table width="100%" cellpadding="8" cellspacing="0" border="0">
                <tr>
                  <td style="color: #6b7280; font-size: 13px; padding: 4px 0;">
                    <strong>${t.metadata.language}:</strong> ${this.escapeHtml(metadata.language)}
                  </td>
                  <td style="color: #6b7280; font-size: 13px; padding: 4px 0;">
                    <strong>${t.metadata.ip}:</strong> ${this.escapeHtml(metadata.ip || 'N/A')}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="color: #6b7280; font-size: 13px; padding: 4px 0;">
                    <strong>${t.metadata.userAgent}:</strong> ${this.escapeHtml(metadata.userAgent || 'N/A')}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="color: #6b7280; font-size: 13px; padding: 4px 0;">
                    <strong>${t.metadata.timestamp}:</strong> ${this.escapeHtml(metadata.timestamp)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- Footer -->
          <tr>
            <td style="background: white; padding: 32px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">

              <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; font-weight: 500;">
                ${t.footer.followUs}
              </p>

              <!-- Social Links -->
              <table width="100%" cellpadding="8" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="https://github.com/SemocaDev"
                       style="display: inline-block; margin: 0 12px; color: #3b7cf5; text-decoration: none; font-size: 14px; font-weight: 500;">
                      GitHub
                    </a>
                    <span style="color: #d1d5db;">•</span>
                    <a href="https://www.linkedin.com/in/sebastian-morea-cañon-5ba97729a/"
                       style="display: inline-block; margin: 0 12px; color: #3b7cf5; text-decoration: none; font-size: 14px; font-weight: 500;">
                      LinkedIn
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px;">
                ${t.footer.contact}: <a href="mailto:${t.footer.email}" style="color: #3b7cf5; text-decoration: none;">${t.footer.email}</a>
              </p>

              <p style="margin: 8px 0 0; color: #d1d5db; font-size: 11px;">
                ${t.footer.copyright.replace('{year}', currentYear.toString())}
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * Construye la versión texto plano del email
   */
  private buildEmailText(message: ContactMessage, t: any, metadata?: EmailMetadata): string {
    const parts = [
      `${t.header.title} - DevMinds Portfolio`,
      '',
      `${t.fields.name}: ${message.name}`,
      `${t.fields.email}: ${message.email}`,
    ];

    if (message.subject) {
      parts.push(`${t.fields.subject}: ${message.subject}`);
    }

    parts.push(
      '',
      `${t.fields.message}:`,
      message.message
    );

    if (metadata) {
      parts.push(
        '',
        '---',
        t.metadata.title,
        `${t.metadata.language}: ${metadata.language}`,
        `${t.metadata.ip}: ${metadata.ip || 'N/A'}`,
        `${t.metadata.userAgent}: ${metadata.userAgent || 'N/A'}`,
        `${t.metadata.timestamp}: ${metadata.timestamp}`
      );
    }

    parts.push(
      '',
      '---',
      `${t.footer.contact}: ${t.footer.email}`,
      `GitHub: https://github.com/SemocaDev`,
      `LinkedIn: https://www.linkedin.com/in/sebastian-morea-cañon-5ba97729a/`
    );

    return parts.join('\n');
  }

  /**
   * Escapa HTML para prevenir XSS
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  }
}
