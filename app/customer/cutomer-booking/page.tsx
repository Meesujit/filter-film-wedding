'use client'
import { formatPrice, getPackageById } from "@/app/data/mockData";
import { Button } from "@/app/src/components/ui/button";
import { useAuth } from "@/app/src/context/AuthContext";
import { useData } from "@/app/src/context/DataContext";
import Link from "next/link";


export default function Page() {
  const { user } = useAuth();
  const { bookings } = useData();
  const userBookings = bookings.filter(b => b.userId === user?.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-3xl font-bold text-foreground">My Bookings</h1>
        <Link href="/book"><Button variant="royal">New Booking</Button></Link>
      </div>

      {userBookings.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <p className="text-muted-foreground mb-4">You don't have any bookings yet.</p>
          <Link href="/customer/packages"><Button>Browse Packages</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userBookings.map(booking => {
            const pkg = getPackageById(booking.packageId);
            return (
              <div key={booking.id} className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-xl font-semibold">{booking.eventName}</h3>
                    <p className="text-muted-foreground">{booking.date} • {booking.venue}</p>
                    <p className="text-sm text-gold mt-1">{pkg?.name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      booking.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                      'bg-red-100 text-red-700'
                    }`}>{booking.status}</span>
                    <p className="font-heading text-xl font-bold mt-2">{formatPrice(booking.totalAmount)}</p>
                    <p className="text-sm text-muted-foreground">Paid: {formatPrice(booking.paidAmount)}</p>
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

