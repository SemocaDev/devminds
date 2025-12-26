import { IContactRepository } from '@/core/domain/contact/ports/IContactRepository';
import { ContactMessage } from '@/core/domain/contact/entities/ContactMessage';

/**
 * Implementación en memoria del repositorio de contactos
 * Útil para desarrollo, testing, o como logging temporal
 *
 * En producción, esto podría ser reemplazado por:
 * - MongoDBContactRepository
 * - PostgreSQLContactRepository
 * - SupabaseContactRepository
 * etc.
 */
export class InMemoryContactRepository implements IContactRepository {
  private messages: Map<string, ContactMessage> = new Map();
  private counter: number = 0;

  async save(message: ContactMessage): Promise<string> {
    this.counter++;
    const id = `contact-${this.counter}-${Date.now()}`;

    this.messages.set(id, message);

    console.log(`[InMemoryContactRepository] Saved message ${id}`);

    return id;
  }

  async findById(id: string): Promise<ContactMessage | null> {
    return this.messages.get(id) || null;
  }

  async findAll(): Promise<ContactMessage[]> {
    return Array.from(this.messages.values());
  }

  /**
   * Método auxiliar para limpiar el repositorio (útil en testing)
   */
  clear(): void {
    this.messages.clear();
    this.counter = 0;
  }

  /**
   * Método auxiliar para obtener estadísticas
   */
  getStats() {
    return {
      totalMessages: this.messages.size,
      messages: Array.from(this.messages.entries()).map(([id, message]) => ({
        id,
        ...message.toJSON()
      }))
    };
  }
}
