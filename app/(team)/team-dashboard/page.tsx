'use client';
import { useAuth } from '@/app/src/context/AuthContext';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { useData } from '@/app/src/context/DataContext';
import { useToast } from '@/app/hooks/use-toast';
import { Button } from '@/app/src/components/ui/button';
import { getPackageById } from '../../data/mockData';

export default function Page() {
  const { user } = useAuth();
  const { bookings, updateBooking } = useData();
  const { toast } = useToast();
  const assignedBookings = bookings.filter(b => b.assignedTeam?.includes(user?.id || ''));

  const handleMarkProgress = (id: string, status: 'in-progress' | 'completed') => {
    updateBooking(id, { status });
    toast({ title: 'Status Updated', description: `Booking marked as ${status}.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Welcome, {user?.name}!</h1>
        <p className="text-muted-foreground">View your assigned bookings and deliverables.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-6 shadow-card">
          <Calendar className="w-8 h-8 text-gold mb-2" />
          <p className="text-2xl font-bold">{assignedBookings.length}</p>
          <p className="text-sm text-muted-foreground">Total Assignments</p>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-card">
          <Clock className="w-8 h-8 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{assignedBookings.filter(b => b.status === 'in-progress').length}</p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-card">
          <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
          <p className="text-2xl font-bold">{assignedBookings.filter(b => b.status === 'completed').length}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-card">
        <div className="p-6 border-b border-border">
          <h2 className="font-heading text-xl font-semibold">My Assignments</h2>
        </div>
        <div className="divide-y divide-border">
          {assignedBookings.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground">No assignments yet.</p>
          ) : (
            assignedBookings.map(booking => {
              const pkg = getPackageById(booking.packageId);
              return (
                <div key={booking.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{booking.eventName}</p>
                    <p className="text-sm text-muted-foreground">{booking.date} • {booking.venue}</p>
                    <p className="text-xs text-gold">{pkg?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{booking.status}</span>
                    {booking.status !== 'completed' && (
                      <Button size="sm" variant="outline" onClick={() => handleMarkProgress(booking.id, booking.status === 'in-progress' ? 'completed' : 'in-progress')}>
                        {booking.status === 'in-progress' ? 'Mark Complete' : 'Start Work'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
