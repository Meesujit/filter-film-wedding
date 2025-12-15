'use client'
import { useToast } from "@/app/hooks/use-toast";
import { Button } from "@/app/src/components/ui/button";
import { Input } from "@/app/src/components/ui/input";
import { useAuth } from "@/app/src/context/AuthContext";

export default function Page() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: 'Profile Updated', description: 'Your profile has been saved.' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-heading text-3xl font-bold text-foreground">My Profile</h1>
      <div className="bg-card rounded-xl p-6 shadow-card max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <img src={user?.avatar} alt={user?.name} className="w-20 h-20 rounded-full object-cover" />
          <div>
            <h2 className="font-heading text-xl font-semibold">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Full Name</label><Input defaultValue={user?.name} /></div>
          <div><label className="block text-sm font-medium mb-1">Email</label><Input defaultValue={user?.email} type="email" /></div>
          <div><label className="block text-sm font-medium mb-1">Phone</label><Input defaultValue={user?.phone} /></div>
          <Button variant="royal" onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};


