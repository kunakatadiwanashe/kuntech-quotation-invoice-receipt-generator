'use client';

import './globals.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppSidebar } from "../src/components/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { useState, useEffect } from 'react';

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
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    if (!time) return "Welcome";

    const hours = time.getHours();

    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Sonner />
            <Toaster />

            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />

                <SidebarInset>
                  {/* HEADER */}
                  <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

                    {/* Top Bar */}
                    <div className="flex h-20 items-center gap-4 px-4 md:px-6">
                      <SidebarTrigger />
                                          {/* Greeting */}
                    <div className="px-4 md:px-6 pb-2">
                      <h1 className="text-lg font-semibold tracking-tight">
                        {mounted ? `${getGreeting()}, Tadiwanashe 👋` : "Welcome"}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Welcome back to Kuntech
                      </p>
                    </div>
                      <div className="flex-1" />

                      {/* Time + Date (safe render) */}
                      {mounted && time && (
                        <div className="text-right text-sm">
                          <div className="font-medium">
                            {time.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {time.toLocaleDateString(undefined, {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                        </div>
                      )}

                      
                    </div>


                  </header>

                  {/* MAIN */}
                  <main className="w-full flex-1">
                    <div className="container mx-auto p-4 md:p-8 lg:p-10">
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