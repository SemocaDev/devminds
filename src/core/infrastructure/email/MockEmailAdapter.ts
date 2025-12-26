import { IEmailService } from '@/core/domain/contact/ports/IEmailService';
import { ContactMessage } from '@/core/domain/contact/entities/ContactMessage';

/**
 * Adaptador Mock para desarrollo/testing
 * Simula el envío de emails sin necesitar configuración externa
 *
 * Útil para:
 * - Desarrollo local sin API keys
 * - Testing
 * - Debugging
 */
export class MockEmailAdapter implements IEmailService {
  async sendContactEmail(message: ContactMessage): Promise<string> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log en consola para debugging
    console.log('📧 [MockEmailAdapter] Email would be sent:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`From: ${message.name} <${message.email}>`);
    console.log(`Subject: ${message.subject || 'No subject'}`);
    console.log(`Message:\n${message.message}`);
    console.log(`Timestamp: ${message.createdAt.toISOString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Simular posible error (5% de probabilidad para testing)
    if (Math.random() < 0.05) {
      throw new Error('Mock email service randomly failed (for testing)');
    }

    // Generar ID mock
    const mockId = `mock-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    return mockId;
  }
}
