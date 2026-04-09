"use client";

import { useState, useEffect } from "react";
import { getDocuments } from "@/lib/store";
import { useRouter } from "next/navigation";
import { FileText, Receipt, DollarSign, Clock } from "lucide-react";
import type { InvoiceDocument } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const router = useRouter();
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

  const stats = [
    { label: "Total Invoices", value: invoices.length, icon: FileText, color: "text-primary" },
    { label: "Paid Invoices", value: paid.length, icon: Receipt, color: "text-success" },
    { label: "Pending", value: pending.length, icon: Clock, color: "text-warning" },
    { label: "Revenue", value: `$${revenue.toLocaleString()}`, icon: DollarSign, color: "text-accent" },
  ];

  const recentDocs = docs.slice(0, 8);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Docs */}
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
                      className={`text-xs font-mono px-2 py-1 rounded ${
                        doc.type === "quotation"
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
    </div>
  );
}