'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, DollarSign, CheckCircle, AlertCircle, Loader2, Eye, X, Package, FileText } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { Input } from '@/app/src/components/ui/input';
import { Button } from '@/app/src/components/ui/button';

interface Booking {
  id: string;
  userId: string;
  packageId: string;
  eventType: string;
  eventName: string;
  date: string;
  venue: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  assignedTeam?: string[];
  createdAt: string;
}

interface PackageInfo {
  id: string;
  name: string;
  price: number;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
  completed: { label: 'Completed', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
};

export default function AssignmentsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // This endpoint will automatically filter bookings for team members
      const bookingsRes = await fetch('/api/admin/booking');
      const packagesRes = await fetch('/api/admin/package');

      const [bookingsData, packagesData] = await Promise.all([
        bookingsRes.json(),
        packagesRes.json()
      ]);

      if (bookingsRes.ok) setBookings(bookingsData.bookings || []);
      if (packagesRes.ok) setPackages(packagesData.packages || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your assignments',
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort bookings by date (upcoming first)
  const sortedBookings = [...filteredBookings].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const upcomingBookings = sortedBookings.filter(b => new Date(b.date) >= new Date());
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const inProgressBookings = bookings.filter(b => b.status === 'in-progress').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">My Assignments</h1>
        <p className="text-muted-foreground">Events assigned to you</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl p-6 shadow-card border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Assignments</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{bookings.length}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl p-6 shadow-card border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">In Progress</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">{inProgressBookings}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
              <Clock className="w-7 h-7 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-xl p-6 shadow-card border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Completed</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">{completedBookings}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 shadow-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background min-w-[160px]"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Assignments List */}
      {sortedBookings.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <Calendar className="w-20 h-20 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No assignments yet</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' 
              ? 'No assignments match your filters' 
              : 'You have no assigned events at the moment'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map((booking) => {
            const pkg = getPackageById(booking.packageId);
            const StatusIcon = statusConfig[booking.status].icon;
            const isUpcoming = new Date(booking.date) >= new Date();

            return (
              <div
                key={booking.id}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-lg transition-all cursor-pointer border border-border hover:border-primary/50"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left: Date Badge */}
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center ${
                      isUpcoming ? 'bg-primary/10 border-2 border-primary' : 'bg-muted border-2 border-border'
                    }`}>
                      <span className={`text-2xl font-bold ${isUpcoming ? 'text-primary' : 'text-muted-foreground'}`}>
                        {new Date(booking.date).getDate()}
                      </span>
                      <span className={`text-xs uppercase ${isUpcoming ? 'text-primary' : 'text-muted-foreground'}`}>
                        {new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-1">{booking.eventName}</h3>
                        <p className="text-sm text-muted-foreground">{booking.eventType}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border ${statusConfig[booking.status].color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig[booking.status].label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{getDaysUntil(booking.date)}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(booking.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium text-foreground truncate">{booking.venue}</p>
                          <p className="text-xs text-muted-foreground">Venue</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Button */}
                  <div className="flex items-center">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="sticky top-0 bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">{selectedBooking.eventName}</h2>
                  <p className="text-muted-foreground mt-1">{selectedBooking.eventType}</p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border ${statusConfig[selectedBooking.status].color}`}>
                  {React.createElement(statusConfig[selectedBooking.status].icon, { className: "w-4 h-4" })}
                  {statusConfig[selectedBooking.status].label}
                </span>
                <span className="text-sm text-muted-foreground">
                  Booking ID: <span className="font-mono">{selectedBooking.id.slice(0, 8)}</span>
                </span>
              </div>

              {/* Date & Time Info */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/20 flex flex-col items-center justify-center border-2 border-primary/30">
                    <span className="text-2xl font-bold text-primary">
                      {new Date(selectedBooking.date).getDate()}
                    </span>
                    <span className="text-xs uppercase text-primary font-medium">
                      {new Date(selectedBooking.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Event Date</p>
                    <p className="font-semibold text-lg text-foreground">{formatDate(selectedBooking.date)}</p>
                    <p className="text-sm text-primary font-medium mt-1">{getDaysUntil(selectedBooking.date)}</p>
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div className="bg-muted/30 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Venue</p>
                    <p className="font-semibold text-foreground">{selectedBooking.venue}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Created on {new Date(selectedBooking.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}