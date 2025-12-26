/**
 * Domain Entity: ContactMessage
 * Representa un mensaje de contacto en el dominio de la aplicación
 */
export class ContactMessage {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly message: string,
    public readonly subject?: string,
    public readonly createdAt: Date = new Date()
  ) {
    this.validate();
  }

  /**
   * Valida los datos del mensaje de contacto
   */
  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Name is required');
    }

    if (!this.email || this.email.trim().length === 0) {
      throw new Error('Email is required');
    }

    if (!this.isValidEmail(this.email)) {
      throw new Error('Invalid email format');
    }

    if (!this.message || this.message.trim().length === 0) {
      throw new Error('Message is required');
    }

    if (this.message.length > 5000) {
      throw new Error('Message is too long (max 5000 characters)');
    }
  }

  /**
   * Valida el formato del email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Convierte el mensaje a un formato serializable
   */
  toJSON() {
    return {
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
      createdAt: this.createdAt.toISOString()
    };
  }
}
