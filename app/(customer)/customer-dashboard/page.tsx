'use client'
import { useAuth } from '@/app/src/context/AuthContext';
import { useData } from '@/app/src/context/DataContext';
import { Package, Calendar, CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  const { user } = useAuth();
  const { bookings } = useData();
  const userBookings = bookings.filter(b => b.userId === user?.id);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Welcome, {user?.name}!</h1>
        <p className="text-muted-foreground">Manage your bookings and explore our packages.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/customer/packages" className="bg-card rounded-xl p-6 shadow-card card-hover">
          <Package className="w-10 h-10 text-gold mb-4" />
          <h3 className="font-semibold text-foreground">Browse Packages</h3>
          <p className="text-sm text-muted-foreground">Explore our wedding packages</p>
        </Link>
        <Link href="/customer/bookings" className="bg-card rounded-xl p-6 shadow-card card-hover">
          <Calendar className="w-10 h-10 text-gold mb-4" />
          <h3 className="font-semibold text-foreground">My Bookings</h3>
          <p className="text-sm text-muted-foreground">{userBookings.length} active bookings</p>
        </Link>
        <Link href="/customer/payments" className="bg-card rounded-xl p-6 shadow-card card-hover">
          <CreditCard className="w-10 h-10 text-gold mb-4" />
          <h3 className="font-semibold text-foreground">Payments</h3>
          <p className="text-sm text-muted-foreground">View payment history</p>
        </Link>
      </div>

      <div className="bg-card rounded-xl shadow-card">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="font-heading text-xl font-semibold">Recent Bookings</h2>
          <Link href="/customer/bookings" className="text-sm text-primary flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {userBookings.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground">No bookings yet. <Link href="/customer/packages" className="text-primary">Browse packages</Link></p>
          ) : (
            userBookings.slice(0, 3).map(booking => (
              <div key={booking.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{booking.eventName}</p>
                  <p className="text-sm text-muted-foreground">{booking.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{booking.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

