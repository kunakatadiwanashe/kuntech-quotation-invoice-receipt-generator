"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LineItem, Customer, DocumentType, PREDEFINED_SERVICES, PaymentMethod } from "@/types";
import { generateDocNumber, saveDocument, saveCustomer, getCustomers } from "@/lib/store";
import { downloadPDF, printPDF } from "@/lib/pdf";
import { Plus, Trash2, Download, Printer } from "lucide-react";
import { getDocuments } from "@/lib/store";
import type { InvoiceDocument } from "@/types";

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

export default function CreateDocument() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams ? searchParams.get('type') ?? 'quotation' : 'quotation';
  const docType = type as DocumentType;
  const existingCustomers = useMemo(() => getCustomers(), []);

  const [customer, setCustomer] = useState<Customer>({
    id: generateId(), name: '', phone: '', email: '', company: '', address: '',
  });
  const [items, setItems] = useState<LineItem[]>([]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('pending');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaid, setAmountPaid] = useState(0);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = (subtotal - discount) * (taxRate / 100);
  const total = subtotal - discount + tax;
  const balance = total - amountPaid;

  const addPredefined = (idx: string) => {
    const svc = PREDEFINED_SERVICES[parseInt(idx)];
    if (!svc) return;
    setItems(prev => [...prev, { ...svc, id: generateId(), quantity: 1 }]);
  };

  const addCustomItem = () => {
    setItems(prev => [...prev, { id: generateId(), name: '', description: '', price: 0, quantity: 1 }]);
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const selectExistingCustomer = (id: string) => {
    const c = existingCustomers.find(c => c.id === id);
    if (c) setCustomer(c);
  };

  const handleSave = () => {
    if (!customer.name || !customer.email || items.length === 0) {
      toast.error('Please fill in customer details and add at least one item.');
      return;
    }
    const doc = {
      id: generateId(),
      documentNumber: generateDocNumber(docType),
      type: docType,
      customer,
      items,
      subtotal,
      tax,
      taxRate,
      discount,
      total,
      createdAt: new Date().toISOString(),
      dueDate: dueDate || undefined,
      validUntil: validUntil || undefined,
      paymentStatus: docType === 'invoice' ? paymentStatus : docType === 'receipt' ? 'paid' as const : undefined,
      paymentMethod: docType === 'receipt' ? paymentMethod : undefined,
      amountPaid: docType === 'receipt' ? amountPaid : undefined,
      balance: docType === 'receipt' ? balance : undefined,
      notes: notes || undefined,
    };

    saveDocument(doc);
    saveCustomer(customer);
    toast.success(`${docType.charAt(0).toUpperCase() + docType.slice(1)} created!`);
    return doc;
  };

  const handleSaveAndDownload = () => {
    const doc = handleSave();
    if (doc) downloadPDF(doc);
  };

  const handleSaveAndPrint = () => {
    const doc = handleSave();
    if (doc) printPDF(doc);
  };

  const handleSaveOnly = () => {
    handleSave();
    router.push('/documents');
  };



  const typeLabel = docType.charAt(0).toUpperCase() + docType.slice(1);







  const [docs, setDocs] = useState<InvoiceDocument[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const documents = getDocuments();
    setDocs(documents);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  const invoices = docs.filter(d => d.type === "invoice");
  const paid = invoices.filter(d => d.paymentStatus === "paid");
  const pending = invoices.filter(d => d.paymentStatus === "pending");
  const revenue = paid.reduce((sum, d) => sum + d.total, 0);


  const recentDocs = docs.slice(0, 8);












  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create {typeLabel}</h1>
        <p className="text-muted-foreground">Fill in the details below</p>
      </div>

      <div className="flex justify-between ">

        <div className="" >
          {/* Customer */}
          <Card className="w-[50vw] mb-6">
            <CardHeader>
              <CardTitle className="text-base">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {existingCustomers.length > 0 && (
                <div>
                  <Label>Select Existing Customer</Label>
                  <Select onValueChange={selectExistingCustomer}>
                    <SelectTrigger><SelectValue placeholder="Choose customer..." /></SelectTrigger>
                    <SelectContent>
                      {existingCustomers.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label htmlFor="customer-name">Name *</Label><Input id="customer-name" value={customer.name} onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))} /></div>
                <div><Label htmlFor="customer-email">Email *</Label><Input id="customer-email" type="email" value={customer.email} onChange={e => setCustomer(p => ({ ...p, email: e.target.value }))} /></div>
                <div><Label htmlFor="customer-phone">Phone</Label><Input id="customer-phone" value={customer.phone} onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))} /></div>
                <div><Label htmlFor="customer-company">Company</Label><Input id="customer-company" value={customer.company} onChange={e => setCustomer(p => ({ ...p, company: e.target.value }))} /></div>
              </div>
              <div><Label htmlFor="customer-address">Address</Label><Textarea id="customer-address" value={customer.address} onChange={e => setCustomer(p => ({ ...p, address: e.target.value }))} rows={2} /></div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Services / Products</CardTitle>
              <div className="flex gap-2">
                <Select onValueChange={addPredefined}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Add predefined..." /></SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_SERVICES.map((s, i) => (
                      <SelectItem key={i} value={String(i)}>{s.name} — ${s.price}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={addCustomItem}><Plus className="h-4 w-4 mr-1" /> Custom</Button>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No items added yet</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-end border-b pb-3">
                      <div className="col-span-3">
                        <Label className="text-xs" htmlFor={`item-${item.id}-name`}>Name</Label>
                        <Input id={`item-${item.id}-name`} value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs" htmlFor={`item-${item.id}-description`}>Description</Label>
                        <Input id={`item-${item.id}-description`} value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs" htmlFor={`item-${item.id}-price`}>Price ($)</Label>
                        <Input id={`item-${item.id}-price`} type="number" min={0} value={item.price} onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs" htmlFor={`item-${item.id}-qty`}>Qty</Label>
                        <Input id={`item-${item.id}-qty`} type="number" min={1} value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)} />
                      </div>
                      <div className="col-span-1 text-right font-semibold text-sm pt-5">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="col-span-1 flex justify-end pt-5">
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calculations & Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Options</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label htmlFor="tax-rate">Tax Rate (%)</Label><Input id="tax-rate" type="number" min={0} value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} /></div>
                  <div><Label htmlFor="discount">Discount ($)</Label><Input id="discount" type="number" min={0} value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} /></div>
                </div>
                {docType === 'quotation' && (
                  <div><Label htmlFor="valid-until">Valid Until</Label><Input id="valid-until" type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} /></div>
                )}
                {docType === 'invoice' && (
                  <>
                    <div><Label htmlFor="due-date">Due Date</Label><Input id="due-date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
                    <div>
                      <Label>Payment Status</Label>
                      <Select value={paymentStatus} onValueChange={(v: any) => setPaymentStatus(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                {docType === 'receipt' && (
                  <>
                    <div>
                      <Label>Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label htmlFor="amount-paid">Amount Paid ($)</Label><Input id="amount-paid" type="number" min={0} value={amountPaid} onChange={e => setAmountPaid(parseFloat(e.target.value) || 0)} /></div>
                  </>
                )}
                <div><Label htmlFor="notes">Notes</Label><Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Additional notes..." /></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><span className="text-destructive">-${discount.toFixed(2)}</span></div>}
                {taxRate > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax ({taxRate}%)</span><span>${tax.toFixed(2)}</span></div>}
                <div className="border-t pt-3 flex justify-between text-lg font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
                {docType === 'receipt' && (
                  <>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount Paid</span><span>${amountPaid.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm font-medium"><span>Balance</span><span className={balance > 0 ? 'text-destructive' : 'text-success'}>${balance.toFixed(2)}</span></div>
                  </>
                )}
                <div className="pt-4 space-y-2">
                  <Button className="w-full" onClick={handleSaveAndDownload}><Download className="h-4 w-4 mr-2" /> Save & Download PDF</Button>
                  <Button variant="outline" className="w-full" onClick={handleSaveAndPrint}><Printer className="h-4 w-4 mr-2" /> Save & Print</Button>
                  <Button variant="secondary" className="w-full" onClick={handleSaveOnly}>Save Only</Button>
                </div>
              </CardContent>
            </Card>
          </div>


        </div>

  {/* Recent Docs */}
        <div className="ml-10" >

          <Card className="w-[25vw] p-4">
          
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Documents</h2>

              {recentDocs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No documents yet. Create your first quotation, invoice, or receipt to get started.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {recentDocs.map((doc) => (
                    <Card
                      key={doc.id}
                      className="hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => router.push("/documents")}
                    >
                      <CardContent className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-xs font-mono px-2 py-1 rounded ${doc.type === "quotation"
                              ? "bg-secondary text-secondary-foreground"
                              : doc.type === "invoice"
                                ? "bg-primary/10 text-primary"
                                : "bg-success/10 text-success"
                              }`}
                          >
                            {doc.documentNumber}
                          </span>
                          <span className="font-medium">
                            {doc.customer.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            ${doc.total.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>

        </div>


      </div>

    </div>
  );
}
