'use client';

import './globals.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppSidebar } from "../src/components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Sonner />
            <Toaster />
            <SidebarProvider>
              <div className="flex min-h-screen w-full ">
                <AppSidebar />
                <SidebarInset>
                  <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-14 items-center gap-4 px-4 md:px-6">
                      <SidebarTrigger />
                      <div className="flex-1" />
                    </div>
                    <div className="px-4 md:px-6">
                      <h1 className="text-lg font-semibold tracking-tight">kuntech</h1>
                    </div>
                  </header>


                  <main className="w-full flex-1">
                    <div className="container  mx-auto p-4 md:p-8 lg:p-10">
                      {children}
                    </div>
                  </main>
                  
                </SidebarInset>
              </div>
            </SidebarProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
