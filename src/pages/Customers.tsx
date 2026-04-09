import { useMemo } from "react";
import { getCustomers } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function Customers() {
  const customers = useMemo(() => getCustomers(), []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">All your saved customers</p>
      </div>

      {customers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
            No customers yet. They'll appear here after you create a document.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map(c => (
            <Card key={c.id}>
              <CardContent className="pt-4 space-y-1">
                <p className="font-semibold">{c.name}</p>
                {c.company && <p className="text-sm text-muted-foreground">{c.company}</p>}
                <p className="text-sm">{c.email}</p>
                <p className="text-sm">{c.phone}</p>
                {c.address && <p className="text-xs text-muted-foreground">{c.address}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
