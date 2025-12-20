'use client';
import { useToast } from '@/app/hooks/use-toast';
import { Button } from '@/app/src/components/ui/button';
import { Input } from '@/app/src/components/ui/input';
import { useAuth } from '@/app/src/context/AuthContext';
import Image from 'next/image';
import React from 'react';


const CustomerProfile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.name,
          email: user?.email,
        }),
      });
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-heading text-3xl font-bold text-foreground">My Profile</h1>
      <div className="bg-card rounded-xl p-6 shadow-card max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Image src={user?.image} alt={user?.name} width={80} height={80} className="rounded-full object-cover" />
          <div>
            <h2 className="font-heading text-xl font-semibold">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Full Name</label><Input defaultValue={user?.name} /></div>
          <div><label className="block text-sm font-medium mb-1">Email</label><Input defaultValue={user?.email} type="email" /></div>
          <Button variant="royal" onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
