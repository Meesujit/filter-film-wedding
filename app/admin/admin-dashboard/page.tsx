'use client'
import Link from 'next/link';
import { useData } from '@/app/src/context/DataContext';
import { Package, Calendar, Image, Users, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/app/data/mockData';


export default function Page() { 
  const { packages, bookings, gallery, team } = useData();

  const stats = [
    {
      label: 'Total Packages',
      value: packages.length,
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/packages',
    },
    {
      label: 'Active Bookings',
      value: bookings.filter(b => b.status !== 'completed' && b.status !== 'rejected').length,
      icon: Calendar,
      color: 'bg-green-500',
      link: '/admin/bookings',
    },
    {
      label: 'Gallery Items',
      value: gallery.length,
      icon: Image,
      color: 'bg-purple-500',
      link: '/admin/gallery',
    },
    {
      label: 'Team Members',
      value: team.length,
      icon: Users,
      color: 'bg-orange-500',
      link: '/admin/team',
    },
  ];

  const totalRevenue = bookings.reduce((sum, b) => sum + b.paidAmount, 0);
  const pendingPayments = bookings.reduce((sum, b) => sum + (b.totalAmount - b.paidAmount), 0);

  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="bg-card rounded-xl p-6 shadow-card card-hover"
          >
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Revenue Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-royal rounded-xl p-6 text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-primary-foreground/70 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-card border-l-4 border-gold">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Pending Payments</p>
              <p className="text-2xl font-bold text-foreground">{formatPrice(pendingPayments)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-card rounded-xl shadow-card">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-foreground">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{booking.eventName}</p>
                <p className="text-sm text-muted-foreground">{booking.date} • {booking.venue}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  booking.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {booking.status}
                </span>
                <p className="text-sm text-muted-foreground mt-1">{formatPrice(booking.totalAmount)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
