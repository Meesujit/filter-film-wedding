'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Type, Loader2 } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { Button } from '@/app/src/components/ui/button';
import { Input } from '@/app/src/components/ui/input';
import { Textarea } from '@/app/src/components/ui/textarea';

interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  deliverables: string[];
  duration: string;
  preview: string;
}

const CustomerBookingForm: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPackages, setFetchingPackages] = useState(true);
  const [formData, setFormData] = useState({
    packageId: '',
    eventType: '',
    eventName: '',
    date: '',
    venue: '',
    notes: '',
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/package');
      const data = await response.json();
      
      if (response.ok) {
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load packages',
        variant: 'destructive'
      });
    } finally {
      setFetchingPackages(false);
    }
  };

  const selectedPackage = packages.find(pkg => pkg.id === formData.packageId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedPackage) {
      toast({
        title: 'Error',
        description: 'Please select a package',
        variant: 'destructive'
      });
      setLoading(false);
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
          paidAmount: 0, // Customer hasn't paid yet
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
        router.push('/customer/bookings'); // Redirect to bookings page
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
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (fetchingPackages) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Book a Service</h1>
        <p className="text-muted-foreground">Fill in the details to book your event.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-card p-6 space-y-6">
        {/* Package Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Package *</label>
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
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-foreground">{selectedPackage.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedPackage.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedPackage.deliverables.map((item, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-background rounded-full">
                  {item}
                </span>
              ))}
            </div>
            <p className="text-lg font-bold text-primary mt-2">{formatPrice(selectedPackage.price)}</p>
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
            onClick={() => router.back()}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="royal"
            className="flex-1"
            disabled={loading || !formData.packageId}
          >
            {loading && (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            )}
            Submit Booking Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerBookingForm;