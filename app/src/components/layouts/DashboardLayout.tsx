"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Package,
  Calendar,
  Image,
  Users,
  Settings,
  LogOut,
  User,
  CreditCard,
  Upload,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";


interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/packages", label: "Manage Packages", icon: Package },
  { href: "/admin/bookings", label: "Manage Bookings", icon: Calendar },
  { href: "/admin/gallery", label: "Manage Gallery", icon: Image },
  { href: "/admin/team", label: "Manage Team", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const customerNav: NavItem[] = [
  { href: "/customer", label: "Dashboard", icon: Home },
  { href: "/customer/packages", label: "Browse Packages", icon: Package },
  { href: "/customer/bookings", label: "My Bookings", icon: Calendar },
  { href: "/customer/payments", label: "Payments", icon: CreditCard },
  { href: "/customer/uploads", label: "My Uploads", icon: Upload },
  { href: "/customer/profile", label: "Profile", icon: User },
];

const teamNav: NavItem[] = [
  { href: "/team-dashboard", label: "Dashboard", icon: Home },
  { href: "/team-dashboard/bookings", label: "My Assignments", icon: Calendar },
  { href: "/team-dashboard/deliverables", label: "Deliverables", icon: Upload },
  { href: "/team-dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAdmin, isCustomer } = useAuth();

  const navItems = isAdmin ? adminNav : isCustomer ? customerNav : teamNav;
  const dashboardTitle = isAdmin
    ? "Admin Panel"
    : isCustomer
    ? "Customer Portal"
    : "Team Portal";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-elegant">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b border-border px-4 h-16 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2">
          <Menu className="w-6 h-6 text-foreground" />
        </button>
        <span className="font-heading font-semibold">{dashboardTitle}</span>
        <div className="w-10" />
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform lg:translate-x-0 lg:static",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="font-heading text-lg font-bold text-primary-foreground">
                  R
                </span>
              </div>
              <div>
                <p className="font-heading text-sm font-bold">Royal Weddings</p>
                <p className="text-xs text-muted-foreground">{dashboardTitle}</p>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User */}
          <div className="p-4 border-b border-border">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>

          {/* Nav */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 w-full p-4 border-t border-border">
            <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm">
              <Home className="w-5 h-5" />
              Back to Website
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
