'use client';
import { useState } from 'react';
import { Save, Building, Mail, Phone, Globe } from 'lucide-react';
import { useToast } from '@/app/src/components/ui/use-toast';
import { Input } from '@/app/src/components/ui/input';
import { Textarea } from '@/app/src/components/ui/textarea';
import { Button } from '@/app/src/components/ui/button';

export default function Page() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    businessName: 'Royal Weddings Studio',
    email: 'info@royalweddings.com',
    phone: '+91 98765 43210',
    address: '42, Royal Plaza, MG Road, New Delhi - 110001',
    website: 'www.royalweddings.com',
    description: 'India\'s premier wedding photography & cinematography studio, crafting timeless memories for over a decade.',
    socialFacebook: 'https://facebook.com/royalweddings',
    socialInstagram: 'https://instagram.com/royalweddings',
    socialYoutube: 'https://youtube.com/royalweddings',
  });

  const handleSave = () => {
    // Simulate saving
    toast({
      title: 'Settings Saved',
      description: 'Your changes have been saved successfully.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your business settings.</p>
      </div>

      <div className="bg-card rounded-xl shadow-card p-6">
        <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Building className="w-5 h-5 text-gold" />
          Business Information
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Business Name</label>
            <Input
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <Input
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Business Address</label>
            <Input
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website
            </label>
            <Input
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Business Description</label>
            <Textarea
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-card p-6">
        <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Social Media Links</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Facebook</label>
            <Input
              value={settings.socialFacebook}
              onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Instagram</label>
            <Input
              value={settings.socialInstagram}
              onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">YouTube</label>
            <Input
              value={settings.socialYoutube}
              onChange={(e) => setSettings({ ...settings, socialYoutube: e.target.value })}
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="royal" onClick={handleSave}>
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

