'use client';
import React, { useState, useEffect } from 'react';
import { Search, Check, X, Eye, Loader2, Edit2, Trash2, ChevronDown, Plus } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { Input } from '@/app/src/components/ui/input';
import { Button } from '@/app/src/components/ui/button';
import { Booking } from '@/app/types/booking';
import { div } from 'framer-motion/client';

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedBooking, setEditedBooking] = useState<Booking | null>(null);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const bookingsRes = await fetch('/api/admin/booking');
      const bookingsData = await bookingsRes.json();

      const packagesRes = await fetch('/api/admin/package');
      const packagesData = await packagesRes.json();

      const teamRes = await fetch('/api/admin/team');
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
      const response = await fetch(`/api/admin/booking/${id}`, {
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

  const handleAssignTeam = async (bookingId: string, teamIds: string[]) => {
    try {
      const response = await fetch(`/api/admin/booking/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTeam: teamIds }),
      });

      if (response.ok) {
        const { booking: updatedBooking } = await response.json();
        setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));

        if (selectedBooking?.id === bookingId) {
          setSelectedBooking(updatedBooking);
        }
        if (editedBooking?.id === bookingId) {
          setEditedBooking(updatedBooking);
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

  const toggleTeamMember = (teamId: string) => {
    if (!editedBooking) return;

    const currentTeam = editedBooking.assignedTeam || [];
    const newTeam = currentTeam.includes(teamId)
      ? currentTeam.filter(t => t !== teamId)
      : [...currentTeam, teamId];

    setEditedBooking({ ...editedBooking, assignedTeam: newTeam });
  };

  const handleSaveEdit = async () => {
    if (!editedBooking) return;

    try {
      const response = await fetch(`/api/admin/booking/${editedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: editedBooking.eventName,
          eventType: editedBooking.eventType,
          date: editedBooking.date,
          venue: editedBooking.venue,
          totalAmount: editedBooking.totalAmount,
          paidAmount: editedBooking.paidAmount,
          notes: editedBooking.notes,
          status: editedBooking.status,
          assignedTeam: editedBooking.assignedTeam,
        }),
      });

      if (response.ok) {
        const { booking: updatedBooking } = await response.json();
        setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
        setSelectedBooking(updatedBooking);
        setIsEditMode(false);
        toast({
          title: 'Booking Updated',
          description: 'Booking has been updated successfully.'
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update booking',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`/api/admin/booking/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        setSelectedBooking(null);
        toast({
          title: 'Booking Deleted',
          description: 'Booking has been deleted successfully.'
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete booking',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete booking',
        variant: 'destructive'
      });
    }
  };

  const openEditMode = (booking: Booking) => {
    setEditedBooking({ ...booking });
    setIsEditMode(true);
  };

  const cancelEdit = () => {
    setEditedBooking(null);
    setIsEditMode(false);
  };

  const getTeamMemberName = (memberId: string) => {
    return team.find(m => m.id === memberId)?.name || 'Unknown';
  };


  return (
    <div className="space-y-0 flex flex-col gap-6">
      <div className='flex item-center justify-between'>
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Manage Bookings</h1>
          <p className="text-muted-foreground">View and manage all booking requests.</p>
        </div>
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
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Assigned</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="h-72 text-center align-middle">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground h-72 align-middle flex flex-col items-center justify-center">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const pkg = getPackageById(booking.packageId);
                  const assignedCount = booking.assignedTeam?.length || 0;
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
                          className={`text-xs px-2 py-1 rounded-full border-0 ${booking.status === 'approved' ? 'bg-green-100 text-green-700' :
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
                        {assignedCount > 0 ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                            {assignedCount} member{assignedCount > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not assigned</span>
                        )}
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
          <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-elegant animate-scale-in">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold">
                {isEditMode ? 'Edit Booking' : 'Booking Details'}
              </h2>
              <div className="flex items-center gap-2">
                {!isEditMode && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => openEditMode(selectedBooking)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(selectedBooking.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </>
                )}
                <button onClick={() => { setSelectedBooking(null); setIsEditMode(false); setEditedBooking(null); }}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {isEditMode && editedBooking ? (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground">Event Name</label>
                    <Input
                      value={editedBooking.eventName}
                      onChange={(e) => setEditedBooking({ ...editedBooking, eventName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Event Type</label>
                      <Input
                        value={editedBooking.eventType}
                        onChange={(e) => setEditedBooking({ ...editedBooking, eventType: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Date</label>
                      <Input
                        type="date"
                        value={editedBooking.date}
                        onChange={(e) => setEditedBooking({ ...editedBooking, date: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Venue</label>
                    <Input
                      value={editedBooking.venue}
                      onChange={(e) => setEditedBooking({ ...editedBooking, venue: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Total Amount</label>
                      <Input
                        type="number"
                        value={editedBooking.totalAmount}
                        onChange={(e) => setEditedBooking({ ...editedBooking, totalAmount: parseFloat(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Paid Amount</label>
                      <Input
                        type="number"
                        value={editedBooking.paidAmount}
                        onChange={(e) => setEditedBooking({ ...editedBooking, paidAmount: parseFloat(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Status</label>
                    <select
                      value={editedBooking.status}
                      onChange={(e) => setEditedBooking({ ...editedBooking, status: e.target.value as Booking['status'] })}
                      className="w-full mt-1 h-10 px-3 rounded-md border border-input bg-background"
                    >
                      {bookingStatuses.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Notes</label>
                    <textarea
                      value={editedBooking.notes || ''}
                      onChange={(e) => setEditedBooking({ ...editedBooking, notes: e.target.value })}
                      className="w-full mt-1 min-h-[80px] px-3 py-2 rounded-md border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Assign Team Members</label>
                    <div className="relative">
                      <button
                        onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-input bg-background hover:bg-muted/50"
                      >
                        <span className="text-sm">
                          {editedBooking.assignedTeam && editedBooking.assignedTeam.length > 0
                            ? `${editedBooking.assignedTeam.length} member(s) selected`
                            : 'Select team members'}
                        </span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showTeamDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {team.length === 0 ? (
                            <div className="p-3 text-sm text-muted-foreground">No team members available</div>
                          ) : (
                            team.map(member => (
                              <button
                                key={member.id}
                                onClick={() => toggleTeamMember(member.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/50 text-left"
                              >
                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${editedBooking.assignedTeam?.includes(member.id)
                                  ? 'bg-primary border-primary'
                                  : 'border-input'
                                  }`}>
                                  {editedBooking.assignedTeam?.includes(member.id) && (
                                    <Check className="w-3 h-3 text-primary-foreground" />
                                  )}
                                </div>
                                <span className="text-sm">{member.name}</span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    {editedBooking.assignedTeam && editedBooking.assignedTeam.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {editedBooking.assignedTeam.map(memberId => (
                          <span key={memberId} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                            {getTeamMemberName(memberId)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveEdit} className="flex-1">Save Changes</Button>
                    <Button onClick={cancelEdit} variant="outline" className="flex-1">Cancel</Button>
                  </div>
                </>
              ) : (
                <>
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
                  <div>
                    <label className="text-sm text-muted-foreground">Status</label>
                    <p className={`inline-block mt-1 text-xs px-3 py-1 rounded-full ${selectedBooking.status === 'approved' ? 'bg-green-100 text-green-700' :
                      selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        selectedBooking.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          selectedBooking.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                            'bg-red-100 text-red-700'
                      }`}>
                      {bookingStatuses.find(s => s.value === selectedBooking.status)?.label}
                    </p>
                  </div>
                  {selectedBooking.notes && (
                    <div>
                      <label className="text-sm text-muted-foreground">Notes</label>
                      <p className="text-sm">{selectedBooking.notes}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Assigned Team</label>
                    {selectedBooking.assignedTeam && selectedBooking.assignedTeam.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedBooking.assignedTeam.map(memberId => (
                          <span key={memberId} className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                            {getTeamMemberName(memberId)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No team members assigned</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;