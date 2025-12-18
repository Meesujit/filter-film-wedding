"use client";

import Link from 'next/link';
import { Package, Calendar, Image, Users, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { useAuth } from '@/app/src/context/AuthContext';

// Mock data - replace with your actual data fetching
const mockData = {
  packages: Array(12).fill(null),
  bookings: [
    {
      id: 1,
      eventName: "Sarah & John's Wedding",
      date: "2024-06-15",
      venue: "Grand Hotel",
      status: "approved",
      totalAmount: 25000,
      paidAmount: 15000,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      eventName: "Emma & Michael's Wedding",
      date: "2024-07-20",
      venue: "Beach Resort",
      status: "pending",
      totalAmount: 30000,
      paidAmount: 10000,
      createdAt: "2024-01-14"
    },
    {
      id: 3,
      eventName: "Lisa & David's Wedding",
      date: "2024-08-10",
      venue: "Garden Paradise",
      status: "in-progress",
      totalAmount: 28000,
      paidAmount: 20000,
      createdAt: "2024-01-13"
    },
    {
      id: 4,
      eventName: "Anna & Peter's Wedding",
      date: "2024-05-25",
      venue: "Royal Palace",
      status: "completed",
      totalAmount: 35000,
      paidAmount: 35000,
      createdAt: "2024-01-12"
    },
    {
      id: 5,
      eventName: "Sophie & James's Wedding",
      date: "2024-09-05",
      venue: "Mountain View",
      status: "approved",
      totalAmount: 22000,
      paidAmount: 12000,
      createdAt: "2024-01-11"
    }
  ],
  gallery: Array(45).fill(null),
  team: Array(8).fill(null)
};

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Total Packages',
      value: mockData.packages.length,
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/packages',
    },
    {
      label: 'Active Bookings',
      value: mockData.bookings.filter(b => b.status !== 'completed' && b.status !== 'rejected').length,
      icon: Calendar,
      color: 'bg-green-500',
      link: '/admin/bookings',
    },
    {
      label: 'Gallery Items',
      value: mockData.gallery.length,
      icon: Image,
      color: 'bg-purple-500',
      link: '/admin/gallery',
    },
    {
      label: 'Team Members',
      value: mockData.team.length,
      icon: Users,
      color: 'bg-orange-500',
      link: '/admin/team',
    },
  ];

  const totalRevenue = mockData.bookings.reduce((sum, b) => sum + b.paidAmount, 0);
  const pendingPayments = mockData.bookings.reduce((sum, b) => sum + (b.totalAmount - b.paidAmount), 0);

  const recentBookings = mockData.bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Revenue Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(pendingPayments)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{booking.eventName}</p>
                  <p className="text-sm text-gray-600">{booking.date} • {booking.venue}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    booking.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {booking.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{formatPrice(booking.totalAmount)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}