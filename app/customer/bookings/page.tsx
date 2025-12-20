'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Package as PackageIcon, Loader2, Plus, X, Type, ArrowLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { Button } from '@/app/src/components/ui/button';
import { Input } from '@/app/src/components/ui/input';
import { Textarea } from '@/app/src/components/ui/textarea';

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

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  deliverables: string[];
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
  completed: { label: 'Completed', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
};

export default function CustomerBookingsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const [formData, setFormData] = useState({
    packageId: '',
    eventType: '',
    eventName: '',
    date: '',
    venue: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, packagesRes] = await Promise.all([
        fetch('/api/admin/booking'),
        fetch('/api/admin/package')
      ]);

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
        description: 'Failed to load data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedPackage = packages.find(pkg => pkg.id === formData.packageId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!selectedPackage) {
      toast({
        title: 'Error',
        description: 'Please select a package',
        variant: 'destructive'
      });
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: formData.packageId,
          eventType: formData.eventType,
          eventName: formData.eventName,
          date: formData.date,
          venue: formData.venue,
          totalAmount: selectedPackage.price,
          paidAmount: 0,
          notes: formData.notes,
          status: 'pending',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Booking Created',
          description: 'Your booking request has been submitted successfully.',
        });
        setFormData({
          packageId: '',
          eventType: '',
          eventName: '',
          date: '',
          venue: '',
          notes: '',
        });
        setShowForm(false);
        fetchData(); // Refresh bookings list
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create booking',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show booking form
  if (showForm) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(false)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bookings
          </Button>
        </div>

        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Book a Service</h1>
          <p className="text-muted-foreground">Fill in the details to book your event</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-card p-6 space-y-6">
          {/* Package Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <PackageIcon className="w-4 h-4 inline mr-1" />
              Select Package *
            </label>
            <select
              required
              value={formData.packageId}
              onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="">Choose a package</option>
              {packages.map(pkg => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - {formatPrice(pkg.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Show selected package details */}
          {selectedPackage && (
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20">
              <h3 className="font-semibold text-lg text-foreground mb-2">{selectedPackage.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{selectedPackage.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedPackage.deliverables.map((item, i) => (
                  <span key={i} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-2xl font-bold text-primary">{formatPrice(selectedPackage.price)}</p>
            </div>
          )}

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Type className="w-4 h-4 inline mr-1" />
                Event Type *
              </label>
              <Input
                required
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                placeholder="e.g., Wedding, Birthday, Corporate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Event Date *
              </label>
              <Input
                required
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Event Name *</label>
            <Input
              required
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              placeholder="e.g., John & Jane's Wedding"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Venue *
            </label>
            <Input
              required
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="Event venue address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Notes</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special requirements or notes..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              className="flex-1"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting || !formData.packageId}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Submit Booking Request
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Show bookings list
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">My Bookings</h1>
          <p className="text-muted-foreground">View and track your event bookings</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Booking
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
          <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {bookings.filter(b => b.status === 'approved' || b.status === 'in-progress').length}
          </p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-bold text-purple-600">
            {bookings.filter(b => b.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="bg-card rounded-xl shadow-card p-12 text-center">
          <PackageIcon className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Bookings Yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't made any bookings yet. Start by booking your first event!
          </p>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create First Booking
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => {
            const pkg = packages.find(p => p.id === booking.packageId);
            const pendingAmount = booking.totalAmount - booking.paidAmount;
            const StatusIcon = statusConfig[booking.status].icon;

            return (
              <div
                key={booking.id}
                className="bg-card rounded-xl shadow-card hover:shadow-lg transition-all cursor-pointer border border-border"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                        {booking.eventName}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {formatDate(booking.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {booking.venue}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Type className="w-4 h-4" />
                          {booking.eventType}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border ${statusConfig[booking.status].color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig[booking.status].label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Package</p>
                      <p className="font-medium text-foreground">{pkg?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                      <p className="font-semibold text-primary">{formatPrice(booking.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Paid</p>
                      <p className="font-semibold text-green-600">{formatPrice(booking.paidAmount)}</p>
                    </div>
                  </div>

                  {pendingAmount > 0 && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-800">Pending Payment</p>
                          <p className="text-xs text-orange-600 mt-0.5">
                            {formatPrice(booking.paidAmount)} of {formatPrice(booking.totalAmount)} paid
                          </p>
                        </div>
                        <p className="text-lg font-bold text-orange-700">
                          {formatPrice(pendingAmount)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
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
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border ${statusConfig[selectedBooking.status].color}`}>
                  {React.createElement(statusConfig[selectedBooking.status].icon, { className: "w-4 h-4" })}
                  {statusConfig[selectedBooking.status].label}
                </span>
                <span className="text-sm text-muted-foreground">
                  ID: <span className="font-mono">{selectedBooking.id.slice(0, 8)}</span>
                </span>
              </div>

              {/* Date & Venue */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Event Date</p>
                  </div>
                  <p className="font-semibold text-foreground">{formatDate(selectedBooking.date)}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Venue</p>
                  </div>
                  <p className="font-semibold text-foreground">{selectedBooking.venue}</p>
                </div>
              </div>

              {/* Package */}
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PackageIcon className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Package</p>
                </div>
                <p className="font-semibold text-foreground">
                  {packages.find(p => p.id === selectedBooking.packageId)?.name || 'N/A'}
                </p>
              </div>

              {/* Payment */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-xl p-5 border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-foreground mb-4">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-foreground">{formatPrice(selectedBooking.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Paid Amount</p>
                    <p className="text-2xl font-bold text-green-600">{formatPrice(selectedBooking.paidAmount)}</p>
                  </div>
                </div>
                {selectedBooking.totalAmount > selectedBooking.paidAmount && (
                  <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                    <p className="text-sm text-muted-foreground mb-1">Pending Amount</p>
                    <p className="text-xl font-bold text-orange-600">
                      {formatPrice(selectedBooking.totalAmount - selectedBooking.paidAmount)}
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-2">Additional Notes</p>
                  <p className="text-sm text-foreground">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                Booked on {formatDate(selectedBooking.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}