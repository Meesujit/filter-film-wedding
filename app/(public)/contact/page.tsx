
'use client'
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Instagram, Facebook, Youtube } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import SectionHeader from '@/app/src/components/common/SectionHeader';
import { Input } from '@/app/src/components/ui/input';
import { Textarea } from '@/app/src/components/ui/textarea';
import { Button } from '@/app/src/components/ui/button';


export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const data = await res.json();
      console.log('Message sent:', data);

      toast({
        title: 'Message Sent!',
        description: "Thank you for reaching out. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        message: '',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      {/* Hero */}
      <section className="relative py-12 overflow-hidden" id='contact'>
        <div className="absolute inset-0 mandala-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader
            title="Contact Us"
            subtitle="Let's discuss how we can capture your special moments."
            centered
          />
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-gradient-elegant">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6 mb-8">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Studio Address
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Gandhinagar 2nd Lane Extension<br />
                    Near Mahamayee College<br />
                    Berhampur, Odisha – 760001
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <p className="text-muted-foreground">+91 9XXXXXXXXX</p>
                  <p className="text-muted-foreground">(Call / WhatsApp)</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground">info@filterfilm.in</p>
                  <p className="text-muted-foreground">bookings@filterfilm.in</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Working Hours
                  </h3>
                  <p className="text-muted-foreground">
                    Monday – Saturday: 10:00 AM – 7:00 PM
                  </p>
                  <p className="text-muted-foreground">
                    Sunday: By Appointment Only
                  </p>
                </div>
              </div>
            </div>


            {/* Contact Form */}
            <div className="bg-card rounded-2xl p-8 shadow-card animate-fade-in delay-200">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Name *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@email.com"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Event Date
                    </label>
                    <Input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Message *
                  </label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your event..."
                    rows={5}
                    className="bg-background"
                  />
                </div>

                <Button type="submit" variant="royal" size="lg" className="w-full group">
                  {loading ? 'Sending...' : 'Send Message'}
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-96 bg-ivory-dark">
        <iframe
          title="Filter Film Studio Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000.532244267929!2d84.78148337281011!3d19.309579535386483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3d5170e456fcfd%3A0x8c02bc510a43c3f4!2sFilter%20Films!5e1!3m2!1sen!2sin!4v1766562605939!5m2!1sen!2sin"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  );
};

