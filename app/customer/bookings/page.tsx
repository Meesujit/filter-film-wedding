'use client';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Package, Loader2, Plus, ArrowLeft, CheckCircle, Clock, AlertCircle, X, FileText } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { Button } from '@/app/src/components/ui/button';
import { Input } from '@/app/src/components/ui/input';
import { Textarea } from '@/app/src/components/ui/textarea';
import { Booking, SelectedBookingPackage, BookingStatus } from '@/app/types/booking';

interface PackageGroup {
  id: string;
  category: string;
  packages: PackageType[];
}

interface PackageType {
  id: string;
  name: string;
  description: string;
  price: number;
  deliverables: string[];
  duration: string;
  preview: string;
}

interface PackageSelection {
  groupId: string;
  packageId: string;
  name: string;
  category: string;
  price: number;
  startDate: string;
  endDate: string;
}

interface BookingFormModal {
  open: boolean;
}

interface BookingDetailsModal {
  open: boolean;
  booking: Booking | null;
}

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
  completed: { label: 'Completed', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
};

export default function CustomerBookingsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packageGroups, setPackageGroups] = useState<PackageGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [bookingFormModal, setBookingFormModal] = useState<BookingFormModal>({
    open: false,
  });

  const [bookingDetailsModal, setBookingDetailsModal] = useState<BookingDetailsModal>({
    open: false,
    booking: null,
  });

  const [formData, setFormData] = useState({
    eventType: '',
    eventName: '',
    startDate: '',
    endDate: '',
    venue: '',
    notes: '',
  });

  const [selectedPackages, setSelectedPackages] = useState<PackageSelection[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, packagesRes] = await Promise.all([
        fetch('/api/admin/booking'),
        fetch('/api/admin/package'),
      ]);

      const [bookingsData, packagesData] = await Promise.all([bookingsRes.json(), packagesRes.json()]);

      if (bookingsRes.ok) setBookings(bookingsData.bookings || []);
      if (packagesRes.ok) setPackageGroups(packagesData.packages || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Modal control functions
  const openBookingForm = () => {
    resetForm();
    setBookingFormModal({ open: true });
  };

  const closeBookingForm = () => {
    setBookingFormModal({ open: false });
    resetForm();
  };

  const openBookingDetails = (booking: Booking) => {
    setBookingDetailsModal({
      open: true,
      booking,
    });
  };

  const closeBookingDetails = () => {
    setBookingDetailsModal({
      open: false,
      booking: null,
    });
  };

  const resetForm = () => {
    setFormData({
      eventType: '',
      eventName: '',
      startDate: '',
      endDate: '',
      venue: '',
      notes: '',
    });
    setSelectedPackages([]);
  };

  const addPackageSelection = (groupId: string, pkg: PackageType, category: string) => {
    const existing = selectedPackages.find(p => p.packageId === pkg.id);
    if (existing) {
      toast({
        title: 'Already Added',
        description: 'This package is already in your selection',
        variant: 'destructive',
      });
      return;
    }

    setSelectedPackages([...selectedPackages, {
      groupId,
      packageId: pkg.id,
      name: pkg.name,
      category,
      price: pkg.price,
      startDate: '',
      endDate: '',
    }]);
  };

  const removePackageSelection = (packageId: string) => {
    setSelectedPackages(selectedPackages.filter(p => p.packageId !== packageId));
  };

  const updatePackageDates = (packageId: string, startDate: string, endDate: string) => {
    setSelectedPackages(selectedPackages.map(p => 
      p.packageId === packageId ? { ...p, startDate, endDate } : p
    ));
  };

  const handleSubmit = async () => {
    if (selectedPackages.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one package',
        variant: 'destructive',
      });
      return;
    }

    // Validate all packages have dates
    const missingDates = selectedPackages.filter(p => !p.startDate || !p.endDate);
    if (missingDates.length > 0) {
      toast({
        title: 'Error',
        description: 'Please set start and end dates for all selected packages',
        variant: 'destructive',
      });
      return;
    }

    // Validate dates
    for (const pkg of selectedPackages) {
      if (new Date(pkg.startDate) > new Date(pkg.endDate)) {
        toast({
          title: 'Error',
          description: `Invalid dates for ${pkg.name}: start date must be before end date`,
          variant: 'destructive',
        });
        return;
      }
    }

    setSubmitting(true);
    try {
      const packagesPayload: SelectedBookingPackage[] = selectedPackages.map(pkg => ({
        groupId: pkg.groupId,
        packageId: pkg.packageId,
        name: pkg.name,
        category: pkg.category,
        startDate: pkg.startDate,
        endDate: pkg.endDate,
      }));

      // Calculate overall event dates from packages
      const allStartDates = selectedPackages.map(p => new Date(p.startDate));
      const allEndDates = selectedPackages.map(p => new Date(p.endDate));
      const overallStartDate = new Date(Math.min(...allStartDates.map(d => d.getTime())));
      const overallEndDate = new Date(Math.max(...allEndDates.map(d => d.getTime())));

      const response = await fetch('/api/admin/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packages: packagesPayload,
          eventType: formData.eventType,
          eventName: formData.eventName,
          startDate: overallStartDate.toISOString().split('T')[0],
          endDate: overallEndDate.toISOString().split('T')[0],
          venue: formData.venue,
          totalAmount: selectedPackages.reduce((acc, p) => acc + p.price, 0),
          paidAmount: 0,
          notes: formData.notes,
          status: 'pending' as BookingStatus,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Booking Created',
          description: 'Your booking request has been submitted successfully.',
        });
        closeBookingForm();
        fetchData();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create booking',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return start === end ? start : `${start} - ${end}`;
  };

  // ---------------- Main Content - Bookings List ----------------
  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">My Bookings</h1>
            <p className="text-muted-foreground">View and track your event bookings</p>
          </div>
          <Button onClick={openBookingForm} className="gap-2">
            <Plus className="w-4 h-4" />
            New Booking
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
          </div>
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</p>
          </div>
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'approved' || b.status === 'in-progress').length}</p>
          </div>
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Completed</p>
            <p className="text-2xl font-bold text-purple-600">{bookings.filter(b => b.status === 'completed').length}</p>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-30" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground mb-6">You haven't made any bookings yet. Start by booking your first event!</p>
              <Button onClick={openBookingForm} className="gap-2">
                <Plus className="w-4 h-4" /> Create First Booking
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Event Name</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Event Type</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date Range</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Venue</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Packages</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map(booking => {
                    const StatusIcon = statusConfig[booking.status].icon;
                    return (
                      <tr key={booking.id} onClick={() => openBookingDetails(booking)} className="hover:bg-accent/50 cursor-pointer transition-colors">
                        <td className="p-4 font-medium text-foreground">{booking.eventName}</td>
                        <td className="p-4 text-sm text-foreground">{booking.eventType}</td>
                        <td className="p-4 text-sm text-foreground">{formatDateRange(booking.startDate, booking.endDate)}</td>
                        <td className="p-4 text-sm text-foreground truncate max-w-xs">{booking.venue}</td>
                        <td className="p-4 text-sm text-foreground">
                          {booking.packages.length} package{booking.packages.length !== 1 ? 's' : ''}
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-semibold text-foreground">{formatPrice(booking.totalAmount)}</p>
                          <p className="text-xs text-muted-foreground">Paid: {formatPrice(booking.paidAmount)}</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[booking.status].color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[booking.status].label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- Booking Form Modal ---------------- */}
      {bookingFormModal.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4 bg-gradient-to-r from-primary/5 to-primary/10">
              <div>
                <h2 className="text-xl font-bold text-foreground">Create New Booking</h2>
                <p className="text-sm text-muted-foreground">Fill in the details to book your event</p>
              </div>
              <button onClick={closeBookingForm} className="hover:bg-accent rounded-full p-1 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-6">
                {/* Event Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg text-foreground">Event Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        Event Type <span className="text-destructive">*</span>
                      </label>
                      <Input
                        required
                        value={formData.eventType}
                        onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                        placeholder="e.g., Wedding, Birthday"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        Event Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        required
                        value={formData.eventName}
                        onChange={e => setFormData({ ...formData, eventName: e.target.value })}
                        placeholder="e.g., John & Jane's Wedding"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Venue <span className="text-destructive">*</span>
                    </label>
                    <Input
                      required
                      value={formData.venue}
                      onChange={e => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="Event venue address"
                    />
                  </div>
                </div>

                {/* Package Selection Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg text-foreground">Select Packages</h3>
                    </div>
                    {selectedPackages.length > 0 && (
                      <span className="text-sm font-medium text-primary">
                        {selectedPackages.length} selected
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {packageGroups.map(group => (
                      <div key={group.id} className="space-y-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-card py-1">
                          {group.category}
                        </h4>
                        {group.packages.map(pkg => {
                          const isSelected = selectedPackages.some(p => p.packageId === pkg.id);
                          return (
                            <div
                              key={pkg.id}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                isSelected 
                                  ? 'bg-primary/5 border-primary/30' 
                                  : 'bg-muted/20 border-border hover:border-primary/20'
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">{pkg.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{pkg.description}</p>
                                <p className="text-sm font-bold text-primary mt-1">{formatPrice(pkg.price)}</p>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant={isSelected ? "outline" : "default"}
                                onClick={() => addPackageSelection(group.id, pkg, group.category)}
                                disabled={isSelected}
                                className="ml-3 shrink-0"
                              >
                                {isSelected ? 'Added' : 'Add'}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Packages with Dates */}
                {selectedPackages.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg text-foreground">Package Dates</h3>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {selectedPackages.map(pkg => (
                        <div key={pkg.packageId} className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{pkg.name}</h4>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">{pkg.category}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-primary">{formatPrice(pkg.price)}</span>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removePackageSelection(pkg.packageId)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1 text-muted-foreground">
                                Start Date <span className="text-destructive">*</span>
                              </label>
                              <Input
                                type="date"
                                required
                                value={pkg.startDate}
                                onChange={e => updatePackageDates(pkg.packageId, e.target.value, pkg.endDate)}
                                min={new Date().toISOString().split('T')[0]}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1 text-muted-foreground">
                                End Date <span className="text-destructive">*</span>
                              </label>
                              <Input
                                type="date"
                                required
                                value={pkg.endDate}
                                onChange={e => updatePackageDates(pkg.packageId, pkg.startDate, e.target.value)}
                                min={pkg.startDate || new Date().toISOString().split('T')[0]}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Amount */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground">Total Amount</span>
                        <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                          {formatPrice(selectedPackages.reduce((sum, p) => sum + p.price, 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Additional Notes
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special requirements or notes..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t px-6 py-4 bg-muted/20 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={closeBookingForm} 
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={submitting || selectedPackages.length === 0}
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {submitting ? 'Submitting...' : 'Submit Booking'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- Booking Details Modal ---------------- */}
      {bookingDetailsModal.open && bookingDetailsModal.booking && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card w-full max-w-3xl my-8 rounded-xl shadow-2xl">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold">Booking Details</h2>
                <p className="text-sm text-muted-foreground">View your booking information</p>
              </div>
              <button onClick={closeBookingDetails}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-foreground">{bookingDetailsModal.booking.eventName}</h3>
                    <p className="text-muted-foreground mt-1">{bookingDetailsModal.booking.eventType}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border ${statusConfig[bookingDetailsModal.booking.status].color}`}>
                    {(() => {
                      const StatusIcon = statusConfig[bookingDetailsModal.booking.status].icon;
                      return <StatusIcon className="w-4 h-4" />;
                    })()}
                    {statusConfig[bookingDetailsModal.booking.status].label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Event Duration</p>
                  </div>
                  <p className="font-semibold text-foreground">{formatDateRange(bookingDetailsModal.booking.startDate, bookingDetailsModal.booking.endDate)}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Venue</p>
                  </div>
                  <p className="font-semibold text-foreground">{bookingDetailsModal.booking.venue}</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Packages</p>
                </div>
                {bookingDetailsModal.booking.packages.map(pkg => (
                  <div key={pkg.packageId} className="p-3 border rounded-md bg-background">
                    <p className="font-medium text-foreground">{pkg.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{pkg.category || 'General'}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {formatDateRange(pkg.startDate, pkg.endDate)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                <h3 className="font-semibold text-foreground mb-4">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-foreground">{formatPrice(bookingDetailsModal.booking.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Paid Amount</p>
                    <p className="text-2xl font-bold text-green-600">{formatPrice(bookingDetailsModal.booking.paidAmount)}</p>
                  </div>
                </div>
                {(() => {
                  const pendingAmount = bookingDetailsModal.booking.totalAmount - bookingDetailsModal.booking.paidAmount;
                  return pendingAmount > 0 && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <p className="text-sm text-muted-foreground mb-1">Pending Amount</p>
                      <p className="text-xl font-bold text-orange-600">{formatPrice(pendingAmount)}</p>
                    </div>
                  );
                })()}
              </div>

              {bookingDetailsModal.booking.notes && (
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-2">Additional Notes</p>
                  <p className="text-sm text-foreground">{bookingDetailsModal.booking.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                <span className="font-mono">ID: {bookingDetailsModal.booking.id.slice(0, 8)}</span> • Booked on {formatDate(bookingDetailsModal.booking.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}