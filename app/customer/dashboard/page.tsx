'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Package as PackageIcon, Loader2, Plus } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { Button } from '@/app/src/components/ui/button';
import { Booking } from '@/app/types/booking';

interface Package {
  id: string;
  name: string;
  price: number;
}

const CustomerBookingsView: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch customer's bookings
      const bookingsRes = await fetch('/api/admin/booking');
      const bookingsData = await bookingsRes.json();

      // Fetch packages to show package names
      const packagesRes = await fetch('/api/admin/package');
      const packagesData = await packagesRes.json();

      if (bookingsRes.ok) {
        setBookings(bookingsData.bookings || []);
      }
      if (packagesRes.ok) {
        setPackages(packagesData.packages || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const getPackageById = (packageId: string) => {
    return packages.find(pkg => pkg.id === packageId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-purple-100 text-purple-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: Booking['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">My Bookings</h1>
          <p className="text-muted-foreground">View and track your event bookings.</p>
        </div>
        <Button variant="royal" onClick={() => router.push('/customer/book')}>
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-card rounded-xl shadow-card p-12 text-center">
          <PackageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't made any bookings yet. Start by booking your first event!
          </p>
          <Button variant="royal" onClick={() => router.push('/customer/booking')}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Booking
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => {
            const pkg = getPackageById(booking.packageId);
            const pendingAmount = booking.totalAmount - booking.paidAmount;

            return (
              <div key={booking.id} className="bg-card rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
                        {booking.eventName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {booking.venue}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Package</p>
                      <p className="font-medium">{pkg?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Event Type</p>
                      <p className="font-medium">{booking.eventType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                      <p className="font-medium text-primary">{formatPrice(booking.totalAmount)}</p>
                    </div>
                  </div>

                  {pendingAmount > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Pending Payment</p>
                          <p className="text-xs text-yellow-600">
                            Paid: {formatPrice(booking.paidAmount)} of {formatPrice(booking.totalAmount)}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-yellow-800">
                          {formatPrice(pendingAmount)}
                        </p>
                      </div>
                    </div>
                  )}

                  {booking.notes && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/customer/bookings/${booking.id}`)}
                    >
                      View Details
                    </Button>
                    {booking.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/customer/bookings/${booking.id}/edit`)}
                      >
                        Edit Booking
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerBookingsView;