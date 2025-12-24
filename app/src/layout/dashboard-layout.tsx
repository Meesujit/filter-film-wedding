"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home, Package, Calendar, Image, Users, LogOut, User, 
  ChevronRight, Loader2, CircleArrowOutUpLeftIcon, ClipboardCheck 
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/lib/firebase/auth-context';

// Navigation items for different roles
const navigationConfig = {
  admin: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/packages', label: 'Manage Packages', icon: Package },
    { href: '/admin/bookings', label: 'Manage Bookings', icon: Calendar },
    { href: '/admin/gallery', label: 'Manage Gallery', icon: Image },
    { href: '/admin/team', label: 'Manage Team', icon: Users },
    { href: '/admin/attendance', label: 'Attendance', icon: ClipboardCheck },
    { href: '/admin/profile', label: 'Profile', icon: User },
  ],
  customer: [
    { href: '/customer/dashboard', label: 'Dashboard', icon: Home },
    { href: '/customer/packages', label: 'Browse Packages', icon: Package },
    { href: '/customer/bookings', label: 'My Bookings', icon: Calendar },
    { href: '/customer/profile', label: 'Profile', icon: User },
  ],
  team: [
    { href: '/team/dashboard', label: 'Dashboard', icon: Home },
    { href: '/team/assignments', label: 'My Assignments', icon: Calendar },
    { href: '/team/attendance', label: 'Attendance', icon: ClipboardCheck },
    { href: '/team/profile', label: 'Profile', icon: User },
  ]
};

const roleConfig = {
  admin: {
    title: 'Admin Panel',
    color: 'purple',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-800',
    primaryClass: 'bg-purple-500',
    hoverClass: 'hover:bg-purple-50',
    activeBorder: 'border-purple-500'
  },
  customer: {
    title: 'Customer Portal',
    color: 'green',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800',
    primaryClass: 'bg-green-500',
    hoverClass: 'hover:bg-green-50',
    activeBorder: 'border-green-500'
  },
  team: {
    title: 'Team Portal',
    color: 'blue',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-800',
    primaryClass: 'bg-blue-500',
    hoverClass: 'hover:bg-blue-50',
    activeBorder: 'border-blue-500'
  }
};

interface UnifiedDashboardProps {
  children: React.ReactNode;
}

const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Derived values from user
  const role = user?.role;

  // Handle redirect in useEffect to avoid render-time navigation
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [loading, user, router]);


  // Don't render anything while redirecting
  if (loading || !user || !role) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const navItems = navigationConfig[role];
  const config = roleConfig[role];

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-elegant">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0`}>
              <span className="font-heading text-lg font-bold text-primary-foreground">F</span>
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-gray-900 truncate">Filter Film Studio</p>
              <p className="text-sm font-bold text-gray-500 truncate">{config.title}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                      ? `bg-primary text-primary-foreground`
                      : `text-muted-foreground hover:bg-muted hover:text-foreground`
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left truncate font-bold text-base">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info Section */}
        <div className="p-3 border-t border-gray-200 bg-card flex-shrink-0">
          {/* <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 font-medium mb-1">Signed in as</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name || user.email}</p>
            <p className="text-xs text-gray-500 capitalize">{role}</p>
          </div> */}
          
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg mb-2 transition-colors"
          >
            <CircleArrowOutUpLeftIcon className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Back to Website</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden h-16 bg-card border-b border-border px-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${config.primaryClass} flex items-center justify-center`}>
              <span className="font-bold text-sm text-white">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <span className="font-semibold text-gray-900">{config.title}</span>
          </div>
          
          <div className="w-10" />
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-card">
          <div className="p-6 lg:p-8">
            {children || (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome to {config.title}
                  </h1>
                  <p className="text-gray-600">
                    Hello, {user.name || user.email}! Here's your dashboard overview.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Dashboard</h3>
                      <Home className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm">Your main dashboard content</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Statistics</h3>
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm">View your analytics and metrics</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm">Perform common tasks quickly</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UnifiedDashboard;