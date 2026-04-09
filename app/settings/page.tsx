import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" /> Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Company:</span> KunTechnologies Ltd.</p>
          <p><span className="text-muted-foreground">Email:</span> info@kuntechnologies.com</p>
          <p><span className="text-muted-foreground">Phone:</span> +254 700 000 000</p>
          <p><span className="text-muted-foreground">Location:</span> Nairobi, Kenya</p>
          <p className="text-xs text-muted-foreground pt-4">
            To update company details, connect for persistent storage.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
