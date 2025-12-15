'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Package,
  CreditCard,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useData } from '@/app/src/context/DataContext';
import { useAuth } from '@/app/src/context/AuthContext';
import { useToast } from '@/app/hooks/use-toast';
import SectionHeader from '@/app/src/components/common/SectionHeader';
import { Button } from '@/app/src/components/ui/button';
import { Input } from '@/app/src/components/ui/input';
import { eventTypes, formatPrice } from '@/app/data/mockData';
import { Textarea } from '@/app/src/components/ui/textarea';



interface PageProps {
  searchParams: {
    package?: string;
  };
}

export default function Page({ searchParams }: PageProps) {
  const preselectedPackage = searchParams.package ?? '';

  const { packages, addBooking } = useData();
  const { user } = useAuth();
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
    packageId: preselectedPackage,
    notes: '',
  });

  const selectedPackage = packages.find(
    (p) => p.id === formData.packageId,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addBooking({
      userId: user?.id || 'guest-user',
      packageId: formData.packageId,
      eventType: formData.eventType,
      eventName:
        formData.eventName ||
        `${formData.name}'s ${formData.eventType}`,
      date: formData.date,
      venue: formData.venue,
      status: 'pending',
      totalAmount: selectedPackage?.price || 0,
      paidAmount: 0,
      notes: formData.notes,
    });

    toast({
      title: 'Booking Submitted!',
      description:
        "Thank you! We'll contact you within 24 hours.",
    });

    setStep(4);
  };

  return (
    <div>
      {/* HERO */}
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

      {/* STEPS */}
      <section className="py-8 bg-ivory-dark border-b border-border">
        <div className="container mx-auto px-4 flex justify-center gap-6">
          {['Event Details', 'Select Package', 'Confirm'].map(
            (label, index) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    step > index + 1
                      ? 'bg-gold text-maroon-dark'
                      : step === index + 1
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > index + 1 ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="hidden sm:block text-sm">
                  {label}
                </span>
              </div>
            ),
          )}
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 bg-gradient-elegant">
        <div className="container mx-auto px-4 max-w-3xl">
          {step === 4 ? (
            /* SUCCESS */
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Booking Confirmed!
              </h2>
              <p className="text-muted-foreground mb-8">
                Our team will contact you shortly.
              </p>
              <Button
                variant="royal"
                onClick={() => (window.location.href = '/')}
              >
                Back to Home
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* STEP 1 */}
              {step === 1 && (
                <div className="bg-card p-8 rounded-2xl shadow-card">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-gold" />
                    Event Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Your Name *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Phone *
                      </label>
                      <Input
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Event Type *
                      </label>
                      <select
                        className="w-full h-10 px-3 rounded-md border bg-background"
                        value={formData.eventType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eventType: e.target.value,
                          })
                        }
                      >
                        {eventTypes.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Event Name
                      </label>
                      <Input
                        value={formData.eventName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eventName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Event Date *
                      </label>
                      <Input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium">
                        Venue *
                      </label>
                      <Input
                        required
                        value={formData.venue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            venue: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-8 text-right">
                    <Button
                      type="button"
                      variant="royal"
                      onClick={() => setStep(2)}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Package className="w-6 h-6 text-gold" />
                    Select Package
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            packageId: pkg.id,
                          })
                        }
                        className={`p-6 rounded-xl border-2 cursor-pointer ${
                          formData.packageId === pkg.id
                            ? 'border-gold'
                            : 'border-transparent'
                        }`}
                      >
                        <h3 className="font-bold">{pkg.name}</h3>
                        <p className="text-gold">
                          {formatPrice(pkg.price)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="royal"
                      disabled={!formData.packageId}
                      onClick={() => setStep(3)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="bg-card p-8 rounded-2xl shadow-card">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-gold" />
                    Confirm Booking
                  </h2>

                  <Textarea
                    placeholder="Additional notes..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notes: e.target.value,
                      })
                    }
                  />

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button type="submit" variant="gold">
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
