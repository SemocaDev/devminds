import { ContactMessage } from '../entities/ContactMessage';

/**
 * Puerto de salida: IEmailService
 * Define el contrato para enviar emails sin depender de una implementación específica
 */
export interface IEmailService {
  /**
   * Envía un email de contacto
   * @param message El mensaje de contacto a enviar
   * @returns Promise que resuelve con el ID del email enviado o rechaza con error
   */
  sendContactEmail(message: ContactMessage): Promise<string>;
}

/**
 * Resultado de envío de email
 */
export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
