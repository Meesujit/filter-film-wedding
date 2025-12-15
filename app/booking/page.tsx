'use client'
import React, { useState } from 'react';
import { Calendar, Package, CreditCard, ArrowRight, Check } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useData } from '../src/context/DataContext';
import { useAuth } from '../src/context/AuthContext';
import { useToast } from '../hooks/use-toast';
import SectionHeader from '../src/components/common/SectionHeader';
import { eventTypes, formatPrice } from '../data/mockData';
import { Button } from '../src/components/ui/button';
import { Input } from '../src/components/ui/input';
import { Textarea } from '../src/components/ui/textarea';


export default function Page() {
  const searchParams = useSearchParams();
  const preselectedPackage = searchParams.get('package');
  const { packages, addBooking } = useData();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    eventType: 'Wedding',
    eventName: '',
    date: '',
    venue: '',
    packageId: preselectedPackage || '',
    guests: '',
    notes: '',
  });

  const selectedPackage = packages.find(p => p.id === formData.packageId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Add booking to dummy state
    addBooking({
      userId: user?.id || 'guest-user',
      packageId: formData.packageId,
      eventType: formData.eventType,
      eventName: formData.eventName || `${formData.name}'s ${formData.eventType}`,
      date: formData.date,
      venue: formData.venue,
      status: 'pending',
      totalAmount: selectedPackage?.price || 0,
      paidAmount: 0,
      notes: formData.notes,
    });

    toast({
      title: "Booking Submitted!",
      description: "Thank you! We'll contact you within 24 hours to confirm your booking.",
    });

    setStep(4); // Success step
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 bg-maroon overflow-hidden">
        <div className="absolute inset-0 mandala-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader
            title="Book Your Date"
            subtitle="Reserve your special day with us."
            light
          />
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-ivory-dark border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            {['Event Details', 'Select Package', 'Confirm'].map((label, index) => (
              <React.Fragment key={label}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step > index + 1 ? 'bg-gold text-maroon-dark' :
                      step === index + 1 ? 'bg-primary text-primary-foreground' :
                        'bg-muted text-muted-foreground'
                    }`}>
                    {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`text-sm hidden sm:block ${step === index + 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`w-12 h-px ${step > index + 1 ? 'bg-gold' : 'bg-border'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Form Steps */}
      <section className="py-16 bg-gradient-elegant">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {step === 4 ? (
              // Success State
              <div className="text-center py-12 animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-gold" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                  Booking Confirmed!
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Thank you for choosing Royal Weddings Studio. Our team will contact
                  you within 24 hours to discuss the details.
                </p>
                <div className="bg-card rounded-xl p-6 shadow-card text-left mb-8">
                  <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Event:</span> {formData.eventName || formData.eventType}</p>
                    <p><span className="text-muted-foreground">Date:</span> {formData.date}</p>
                    <p><span className="text-muted-foreground">Venue:</span> {formData.venue}</p>
                    <p><span className="text-muted-foreground">Package:</span> {selectedPackage?.name}</p>
                    <p><span className="text-muted-foreground">Total:</span> {formatPrice(selectedPackage?.price || 0)}</p>
                  </div>
                </div>
                <Button variant="royal" onClick={() => window.location.href = '/'}>
                  Back to Home
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="bg-card rounded-2xl p-8 shadow-card animate-fade-in">
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-gold" />
                      Event Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Your Name *
                        </label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone *
                        </label>
                        <Input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Event Type *
                        </label>
                        <select
                          required
                          value={formData.eventType}
                          onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                        >
                          {eventTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Event Name
                        </label>
                        <Input
                          value={formData.eventName}
                          onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                          placeholder="e.g., Priya & Vikram Wedding"
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Event Date *
                        </label>
                        <Input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="bg-background"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Venue *
                        </label>
                        <Input
                          required
                          value={formData.venue}
                          onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                          placeholder="Venue name and city"
                          className="bg-background"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Button type="button" variant="royal" onClick={() => setStep(2)} className="group">
                        Next: Select Package
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-fade-in">
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <Package className="w-6 h-6 text-gold" />
                      Select Your Package
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      {packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className={`bg-card rounded-xl p-6 cursor-pointer transition-all border-2 ${formData.packageId === pkg.id
                              ? 'border-gold shadow-gold'
                              : 'border-transparent shadow-card hover:border-gold/50'
                            }`}
                          onClick={() => setFormData({ ...formData, packageId: pkg.id })}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-heading text-lg font-semibold text-foreground">
                                {pkg.name}
                              </h3>
                              <p className="text-gold font-bold">{formatPrice(pkg.price)}</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.packageId === pkg.id
                                ? 'border-gold bg-gold'
                                : 'border-border'
                              }`}>
                              {formData.packageId === pkg.id && (
                                <Check className="w-4 h-4 text-maroon-dark" />
                              )}
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">{pkg.description}</p>
                          <p className="text-xs text-muted-foreground">{pkg.duration} • {pkg.deliverables.length} deliverables</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button
                        type="button"
                        variant="royal"
                        onClick={() => setStep(3)}
                        disabled={!formData.packageId}
                        className="group"
                      >
                        Next: Confirm
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="bg-card rounded-2xl p-8 shadow-card animate-fade-in">
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <CreditCard className="w-6 h-6 text-gold" />
                      Confirm Booking
                    </h2>

                    <div className="bg-ivory-dark rounded-xl p-6 mb-6">
                      <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Event</span>
                          <span className="font-medium">{formData.eventName || formData.eventType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span className="font-medium">{formData.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Venue</span>
                          <span className="font-medium">{formData.venue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Package</span>
                          <span className="font-medium">{selectedPackage?.name}</span>
                        </div>
                        <div className="border-t border-border pt-3 flex justify-between">
                          <span className="font-semibold">Total Amount</span>
                          <span className="font-heading text-xl font-bold text-primary">
                            {formatPrice(selectedPackage?.price || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Additional Notes
                      </label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any special requirements or requests..."
                        rows={3}
                        className="bg-background"
                      />
                    </div>

                    <p className="text-sm text-muted-foreground mb-6">
                      By submitting this booking, you agree to our terms and conditions.
                      Our team will contact you within 24 hours to confirm availability and discuss payment options.
                    </p>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button type="submit" variant="gold" size="lg" className="group">
                        Confirm Booking
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

