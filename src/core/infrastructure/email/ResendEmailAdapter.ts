import { IEmailService } from '@/core/domain/contact/ports/IEmailService';
import { ContactMessage } from '@/core/domain/contact/entities/ContactMessage';

/**
 * Adaptador de Resend para el servicio de email
 * Implementa IEmailService usando la API de Resend
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

  async sendContactEmail(message: ContactMessage): Promise<string> {
    try {
      // Importar dinámicamente Resend para evitar errores si no está instalado
      const { Resend } = await import('resend');
      const resend = new Resend(this.apiKey);

      const response = await resend.emails.send({
        from: this.fromEmail,
        to: this.toEmail,
        replyTo: message.email,
        subject: message.subject || `New Contact from ${message.name}`,
        html: this.buildEmailHtml(message),
        text: this.buildEmailText(message)
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
   * Construye el HTML del email
   */
  private buildEmailHtml(message: ContactMessage): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #3b82f6; margin-bottom: 5px; }
            .value { background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; }
            .message-box { background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #8b5cf6; min-height: 100px; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📧 New Contact Message</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">DevMinds Portfolio Contact Form</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">${this.escapeHtml(message.name)}</div>
              </div>

              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${this.escapeHtml(message.email)}">${this.escapeHtml(message.email)}</a></div>
              </div>

              ${message.subject ? `
              <div class="field">
                <div class="label">📋 Subject:</div>
                <div class="value">${this.escapeHtml(message.subject)}</div>
              </div>
              ` : ''}

              <div class="field">
                <div class="label">💬 Message:</div>
                <div class="message-box">${this.escapeHtml(message.message).replace(/\n/g, '<br>')}</div>
              </div>

              <div class="footer">
                <p>Received on ${message.createdAt.toLocaleString('en-US', {
                  dateStyle: 'full',
                  timeStyle: 'short'
                })}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Construye la versión texto plano del email
   */
  private buildEmailText(message: ContactMessage): string {
    return `
New Contact Message - DevMinds Portfolio

Name: ${message.name}
Email: ${message.email}
${message.subject ? `Subject: ${message.subject}\n` : ''}

Message:
${message.message}

---
Received on ${message.createdAt.toLocaleString()}
    `.trim();
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
