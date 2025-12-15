'use client';

import React, { useState } from 'react';
import { Calendar, Package, CreditCard, ArrowRight, Check } from 'lucide-react';
import { useData } from '../src/context/DataContext';
import { useAuth } from '../src/context/AuthContext';
import { useToast } from '../hooks/use-toast';
import SectionHeader from '../src/components/common/SectionHeader';
import { eventTypes, formatPrice } from '../data/mockData';
import { Button } from '../src/components/ui/button';
import { Input } from '../src/components/ui/input';
import { Textarea } from '../src/components/ui/textarea';

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
    guests: '',
    notes: '',
  });

  const selectedPackage = packages.find(p => p.id === formData.packageId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      title: 'Booking Submitted!',
      description: "We'll contact you within 24 hours.",
    });

    setStep(4);
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

      {/* Progress */}
      <section className="py-8 bg-ivory-dark border-b border-border">
        <div className="container mx-auto px-4 flex justify-center gap-4">
          {['Event Details', 'Select Package', 'Confirm'].map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step > index + 1 ? 'bg-gold text-maroon-dark' :
                  step === index + 1 ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'}`}
              >
                {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="hidden sm:block text-sm">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section className="py-16 bg-gradient-elegant">
        <div className="container mx-auto px-4 max-w-3xl">
          {step === 4 ? (
            <div className="text-center py-12">
              <Check className="w-16 h-16 text-gold mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-6">
                Our team will contact you soon.
              </p>
              <Button variant="royal" onClick={() => location.href = '/'}>
                Back to Home
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* STEP CONTENT — unchanged */}
              {/* Your step 1 / 2 / 3 JSX remains EXACTLY the same */}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
