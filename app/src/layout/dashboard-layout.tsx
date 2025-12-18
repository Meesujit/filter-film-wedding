"use client";

import React, { useState } from 'react';
import { Menu, X, Home, Package, Calendar, Image, Users, Settings, LogOut, User, CreditCard, Upload, ChevronRight, FileText } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

// Navigation items for different roles
const navigationConfig = {
  admin: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/packages', label: 'Manage Packages', icon: Package },
    { href: '/admin/bookings', label: 'Manage Bookings', icon: Calendar },
    { href: '/admin/gallery', label: 'Manage Gallery', icon: Image },
    { href: '/admin/team', label: 'Manage Team', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ],
  customer: [
    { href: '/customer/dashboard', label: 'Dashboard', icon: Home },
    { href: '/customer/packages', label: 'Browse Packages', icon: Package },
    { href: '/customer/bookings', label: 'My Bookings', icon: Calendar },
    { href: '/customer/profile', label: 'Profile', icon: User },
  ],
  team: [
    { href: '/team/dashboard', label: 'Dashboard', icon: Home },
    { href: '/team/bookings', label: 'My Assignments', icon: Calendar },
    { href: '/team/deliverables', label: 'Deliverables', icon: Upload },
    { href: '/team/reports', label: 'Reports', icon: FileText },
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
  const { user, logout, role, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated' || !user || !role) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  const navItems = navigationConfig[role];
  const config = roleConfig[role];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${config.primaryClass} flex items-center justify-center`}>
            <span className="font-bold text-sm text-white">R</span>
          </div>
          <span className="font-semibold text-gray-900">{config.title}</span>
        </div>
        <div className="w-10" />
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static shadow-lg ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${config.primaryClass} flex items-center justify-center`}>
                <span className="font-bold text-lg text-white">R</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Royal Weddings</p>
                <p className="text-xs text-gray-500">{config.title}</p>
              </div>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'User avatar'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className={`w-10 h-10 rounded-full ${config.primaryClass} flex items-center justify-center border-2 border-white shadow-sm`}>
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bgClass} ${config.textClass}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? `${config.primaryClass} text-white shadow-sm`
                      : `text-gray-700 ${config.hoverClass}`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <Link
              href="/"
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg mb-2 transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Website
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UnifiedDashboard;