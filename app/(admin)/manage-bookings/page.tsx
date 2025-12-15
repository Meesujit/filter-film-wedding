'use client'
import { useState } from 'react';
import { Search, Check, X, Eye } from 'lucide-react';
import { useData } from '@/app/src/context/DataContext';
import { useToast } from '@/app/src/components/ui/use-toast';
import { Input } from '@/app/src/components/ui/input';
import { bookingStatuses, formatPrice, getPackageById } from '@/app/data/mockData';
import { Button } from '@/app/src/components/ui/button';

export default function Page() {
  const { bookings, updateBooking, team } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: typeof bookings[0]['status']) => {
    updateBooking(id, { status });
    toast({
      title: 'Status Updated',
      description: `Booking status changed to ${status}.`,
    });
  };

  const handleAssignTeam = (bookingId: string, teamId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      const currentTeam = booking.assignedTeam || [];
      const newTeam = currentTeam.includes(teamId)
        ? currentTeam.filter(t => t !== teamId)
        : [...currentTeam, teamId];
      updateBooking(bookingId, { assignedTeam: newTeam });
      toast({ title: 'Team Updated', description: 'Team assignment has been updated.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Manage Bookings</h1>
        <p className="text-muted-foreground">View and manage all booking requests.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background"
        >
          <option value="all">All Status</option>
          {bookingStatuses.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Event</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Package</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBookings.map((booking) => {
                const pkg = getPackageById(booking.packageId);
                return (
                  <tr key={booking.id} className="hover:bg-muted/30">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{booking.eventName}</p>
                      <p className="text-sm text-muted-foreground">{booking.venue}</p>
                    </td>
                    <td className="p-4 text-sm text-foreground">{booking.date}</td>
                    <td className="p-4 text-sm text-foreground">{pkg?.name}</td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-foreground">{formatPrice(booking.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">Paid: {formatPrice(booking.paidAmount)}</p>
                    </td>
                    <td className="p-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value as typeof booking.status)}
                        className={`text-xs px-2 py-1 rounded-full border-0 ${
                          booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          booking.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        {bookingStatuses.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50">
          <div className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-elegant animate-scale-in">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Event</label>
                <p className="font-medium">{selectedBooking.eventName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Date</label>
                  <p className="font-medium">{selectedBooking.date}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Type</label>
                  <p className="font-medium">{selectedBooking.eventType}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Venue</label>
                <p className="font-medium">{selectedBooking.venue}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Total Amount</label>
                  <p className="font-medium text-primary">{formatPrice(selectedBooking.totalAmount)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Paid Amount</label>
                  <p className="font-medium text-green-600">{formatPrice(selectedBooking.paidAmount)}</p>
                </div>
              </div>
              {selectedBooking.notes && (
                <div>
                  <label className="text-sm text-muted-foreground">Notes</label>
                  <p className="text-sm">{selectedBooking.notes}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Assign Team</label>
                <div className="flex flex-wrap gap-2">
                  {team.map(member => (
                    <button
                      key={member.id}
                      onClick={() => handleAssignTeam(selectedBooking.id, member.id)}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors ${
                        selectedBooking.assignedTeam?.includes(member.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {selectedBooking.assignedTeam?.includes(member.id) && <Check className="w-3 h-3" />}
                      {member.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
