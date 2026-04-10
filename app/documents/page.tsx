"use client";


import { useMemo, useState } from "react";
import { getDocuments } from "@/lib/store";
import { downloadPDF } from "@/lib/pdf";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search } from "lucide-react";

export default function Documents() {
  const allDocs = useMemo(() => getDocuments(), []);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = allDocs.filter(d => {
    const matchesSearch = !search ||
      d.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      d.documentNumber.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || d.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">View and manage all your documents</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name or document number..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="quotation">Quotations</SelectItem>
            <SelectItem value="invoice">Invoices</SelectItem>
            <SelectItem value="receipt">Receipts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No documents found.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(doc => (
            <Card key={doc.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`text-xs font-mono px-2 py-1 rounded ${
                    doc.type === 'quotation' ? 'bg-secondary text-secondary-foreground' :
                    doc.type === 'invoice' ? 'bg-primary/10 text-primary' :
                    'bg-success/10 text-success'
                  }`}>{doc.documentNumber}</span>
                  <span className="font-medium">{doc.customer.name}</span>
                  {doc.paymentStatus && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${doc.paymentStatus === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      {doc.paymentStatus}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">${doc.total.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString()}</span>
                  <Button variant="ghost" size="icon" onClick={() => downloadPDF(doc)}><Download className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
