import { InvoiceDocument, Customer } from '@/types';
import { getItem, setItem } from './clientStorage';

const DOCS_KEY = 'kun_documents';
const CUSTOMERS_KEY = 'kun_customers';
const COUNTERS_KEY = 'kun_counters';

function getCounters(): { quotation: number; invoice: number; receipt: number } {
  const data = getItem(COUNTERS_KEY);
  return data ? JSON.parse(data) : { quotation: 0, invoice: 0, receipt: 0 };
}

function saveCounters(c: { quotation: number; invoice: number; receipt: number }) {
  setItem(COUNTERS_KEY, JSON.stringify(c));
}

export function generateDocNumber(type: 'quotation' | 'invoice' | 'receipt'): string {
  const counters = getCounters();
  counters[type]++;
  saveCounters(counters);
  const prefix = type === 'quotation' ? 'QUO' : type === 'invoice' ? 'INV' : 'REC';
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(counters[type]).padStart(4, '0')}`;
}

export function getDocuments(): InvoiceDocument[] {
  const data = getItem(DOCS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveDocument(doc: InvoiceDocument) {
  const docs = getDocuments();
  const idx = docs.findIndex(d => d.id === doc.id);
  if (idx >= 0) docs[idx] = doc;
  else docs.unshift(doc);
  setItem(DOCS_KEY, JSON.stringify(docs));
}

export function getCustomers(): Customer[] {
  const data = getItem(CUSTOMERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCustomer(customer: Customer) {
  const customers = getCustomers();
  const idx = customers.findIndex(c => c.id === customer.id);
  if (idx >= 0) customers[idx] = customer;
  else customers.unshift(customer);
  setItem(CUSTOMERS_KEY, JSON.stringify(customers));
}

