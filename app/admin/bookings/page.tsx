'use client';
import React, { useState, useEffect } from 'react';
import { Search, Check, X, Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { Input } from '@/app/src/components/ui/input';
import { Button } from '@/app/src/components/ui/button';
import { Booking } from '@/app/types/booking';

interface Package {
  id: string;
  name: string;
  price: number;
}

interface TeamMember {
  id: string;
  name: string;
}

const bookingStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
];

const ManageBookings: React.FC = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch bookings, packages, and team on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      const bookingsRes = await fetch('/api/booking');
      const bookingsData = await bookingsRes.json();
      
      // Fetch packages
      const packagesRes = await fetch('/api/package');
      const packagesData = await packagesRes.json();
      
      // Fetch team (you'll need to create this endpoint)
      const teamRes = await fetch('/api/team');
      const teamData = await teamRes.json();
      
      if (bookingsRes.ok) {
        setBookings(bookingsData.bookings || []);
      }
      if (packagesRes.ok) {
        setPackages(packagesData.packages || []);
      }
      if (teamRes.ok) {
        setTeam(teamData.team || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

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

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, status: Booking['status']) => {
    try {
      const response = await fetch(`/api/booking/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const { booking } = await response.json();
        setBookings(prev => prev.map(b => b.id === id ? booking : b));
        toast({
          title: 'Status Updated',
          description: `Booking status changed to ${status}.`,
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update status',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleAssignTeam = async (bookingId: string, teamId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const currentTeam = booking.assignedTeam || [];
    const newTeam = currentTeam.includes(teamId)
      ? currentTeam.filter(t => t !== teamId)
      : [...currentTeam, teamId];

    try {
      const response = await fetch(`/api/booking/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTeam: newTeam }),
      });

      if (response.ok) {
        const { booking: updatedBooking } = await response.json();
        setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));
        
        // Update selected booking if it's the one being modified
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking(updatedBooking);
        }
        
        toast({ 
          title: 'Team Updated', 
          description: 'Team assignment has been updated.' 
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update team',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating team:', error);
      toast({
        title: 'Error',
        description: 'Failed to update team',
        variant: 'destructive'
      });
    }
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
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const pkg = getPackageById(booking.packageId);
                  return (
                    <tr key={booking.id} className="hover:bg-muted/30">
                      <td className="p-4">
                        <p className="font-medium text-foreground">{booking.eventName}</p>
                        <p className="text-sm text-muted-foreground">{booking.venue}</p>
                      </td>
                      <td className="p-4 text-sm text-foreground">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-foreground">{pkg?.name || 'N/A'}</td>
                      <td className="p-4">
                        <p className="text-sm font-medium text-foreground">{formatPrice(booking.totalAmount)}</p>
                        <p className="text-xs text-muted-foreground">Paid: {formatPrice(booking.paidAmount)}</p>
                      </td>
                      <td className="p-4">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking['status'])}
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
                })
              )}
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
                  <p className="font-medium">{new Date(selectedBooking.date).toLocaleDateString()}</p>
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
                  {team.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No team members available</p>
                  ) : (
                    team.map(member => (
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
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;