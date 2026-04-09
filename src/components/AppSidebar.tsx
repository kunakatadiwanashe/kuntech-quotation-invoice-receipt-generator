"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  PlusCircle,
  FilePlus,
  Receipt,
  LogOut,
  User
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"

import Image from "next/image"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Create Quotation", url: "/documents/create?type=quotation", icon: FilePlus },
  { title: "Create Invoice", url: "/documents/create?type=invoice", icon: PlusCircle },
  { title: "Create Receipt", url: "/documents/create?type=receipt", icon: Receipt },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // TODO: replace with real auth logout
    localStorage.clear()
    router.push("/login")
  }

  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader className="flex h-14 px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Kuntech Logo"
            width={52}
            height={52}
          />
        </div>
      </SidebarHeader>

      {/* Main Menu */}
      <SidebarContent className="pt-20">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link
                        href={item.url as any}
                        className="flex items-center gap-3 pt-6 pb-6 text-sm font-medium"
                      >
                        <item.icon
                          className={cn(
                            "h-12 w-12",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />

                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom Section */}
      <SidebarFooter className="p-4 border-t">
        <div className="flex flex-col gap-3">
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Tadiwanashe</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-primary transition"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>

        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}