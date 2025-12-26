import { ContactMessage } from '../entities/ContactMessage';

/**
 * Puerto de salida: IContactRepository
 * Define el contrato para persistir mensajes de contacto
 * (Opcional - útil para logging, analytics, o futuro CRM)
 */
export interface IContactRepository {
  /**
   * Guarda un mensaje de contacto
   * @param message El mensaje de contacto a guardar
   * @returns Promise que resuelve con el ID del mensaje guardado
   */
  save(message: ContactMessage): Promise<string>;

  /**
   * Obtiene un mensaje de contacto por ID
   * @param id El ID del mensaje
   * @returns Promise que resuelve con el mensaje o null si no existe
   */
  findById(id: string): Promise<ContactMessage | null>;

  /**
   * Obtiene todos los mensajes de contacto
   * @returns Promise que resuelve con array de mensajes
   */
  findAll(): Promise<ContactMessage[]>;
}
