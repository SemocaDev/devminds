import { ContactMessage } from '../entities/ContactMessage';

/**
 * Metadata técnica del email (para debugging y contexto)
 */
export interface EmailMetadata {
  ip?: string;
  userAgent?: string;
  timestamp: string;
  language: string;
}

/**
 * Puerto de salida: IEmailService
 * Define el contrato para enviar emails sin depender de una implementación específica
 */
export interface IEmailService {
  /**
   * Envía un email de contacto
   * @param message El mensaje de contacto a enviar
   * @param locale Idioma del formulario (es, en, ja) para traducciones del email
   * @param metadata Información técnica adicional (opcional, solo para emails recibidos)
   * @returns Promise que resuelve con el ID del email enviado o rechaza con error
   */
  sendContactEmail(
    message: ContactMessage,
    locale?: string,
    metadata?: EmailMetadata
  ): Promise<string>;
}

/**
 * Resultado de envío de email
 */
export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
