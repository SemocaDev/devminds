import { ContactMessage } from '../entities/ContactMessage';
import { IEmailService } from '../ports/IEmailService';
import { IContactRepository } from '../ports/IContactRepository';

/**
 * Datos de entrada para el caso de uso
 */
export interface SendContactMessageDTO {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

/**
 * Resultado del caso de uso
 */
export interface SendContactMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Caso de Uso: SendContactMessage
 * Encapsula la lógica de negocio para enviar un mensaje de contacto
 *
 * Principios aplicados:
 * - Single Responsibility: Solo se encarga de coordinar el envío de mensajes
 * - Dependency Inversion: Depende de abstracciones (IEmailService) no de implementaciones concretas
 * - Open/Closed: Abierto a extensión (nuevos adaptadores) cerrado a modificación
 */
export class SendContactMessage {
  constructor(
    private readonly emailService: IEmailService,
    private readonly contactRepository?: IContactRepository
  ) {}

  /**
   * Ejecuta el caso de uso de enviar un mensaje de contacto
   */
  async execute(dto: SendContactMessageDTO): Promise<SendContactMessageResult> {
    try {
      // 1. Crear la entidad de dominio (incluye validación)
      const contactMessage = new ContactMessage(
        dto.name,
        dto.email,
        dto.message,
        dto.subject
      );

      // 2. (Opcional) Persistir el mensaje para logging/analytics
      if (this.contactRepository) {
        await this.contactRepository.save(contactMessage);
      }

      // 3. Enviar el email a través del servicio
      const messageId = await this.emailService.sendContactEmail(contactMessage);

      // 4. Retornar resultado exitoso
      return {
        success: true,
        messageId
      };
    } catch (error) {
      // Manejo de errores
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      console.error('[SendContactMessage] Error:', errorMessage);

      return {
        success: false,
        error: errorMessage
      };
    }
  }
}
