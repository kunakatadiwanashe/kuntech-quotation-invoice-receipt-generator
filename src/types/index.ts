export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  company?: string;
  address: string;
}

export interface LineItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export type DocumentType = 'quotation' | 'invoice' | 'receipt';
export type PaymentStatus = 'paid' | 'pending';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money';

export interface InvoiceDocument {
  id: string;
  documentNumber: string;
  type: DocumentType;
  customer: Customer;
  items: LineItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  createdAt: string;
  dueDate?: string;
  validUntil?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  amountPaid?: number;
  balance?: number;
  notes?: string;
}

export const PREDEFINED_SERVICES: Omit<LineItem, 'id' | 'quantity'>[] = [
  { name: 'Web Development', description: 'Custom website development', price: 500 },
  { name: 'Mobile App Development', description: 'iOS/Android application', price: 1500 },
  { name: 'UI/UX Design', description: 'User interface and experience design', price: 300 },
  { name: 'SEO Optimization', description: 'Search engine optimization', price: 200 },
  { name: 'Cloud Hosting', description: 'Monthly cloud hosting service', price: 50 },
  { name: 'IT Consultation', description: 'Professional IT consultation', price: 100 },
  { name: 'Network Setup', description: 'Network infrastructure setup', price: 400 },
  { name: 'Cyber Security Audit', description: 'Security assessment and audit', price: 600 },
  { name: 'Data Backup Service', description: 'Automated data backup solution', price: 150 },
  { name: 'Technical Support', description: 'Monthly technical support plan', price: 75 },
];
