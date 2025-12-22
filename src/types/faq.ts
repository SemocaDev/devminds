export interface FAQItem {
  id: string;
}

export interface FAQData {
  general: FAQItem[];
  services: FAQItem[];
  pricing: FAQItem[];
  technical: FAQItem[];
}

export type FAQCategory = 'general' | 'services' | 'pricing' | 'technical';
