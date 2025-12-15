'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, Shield, Users, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { credentials } from '@/app/data/mockData';
import { useAuth } from '@/app/src/context/AuthContext';
import { useToast } from '@/app/hooks/use-toast';
import { Input } from '@/app/src/components/ui/input';
import { Button } from '@/app/src/components/ui/button';


type Role = 'admin' | 'customer' | 'team';

const roleInfo = {
  admin: {
    icon: Shield,
    title: 'Admin',
    description: 'Manage packages, bookings & team',
    email: credentials.admin.email,
    password: credentials.admin.password,
  },
  customer: {
    icon: Users,
    title: 'Customer',
    description: 'Browse packages & manage bookings',
    email: credentials.customer.email,
    password: credentials.customer.password,
  },
  team: {
    icon: Camera,
    title: 'Studio Team',
    description: 'View assigned work & upload deliverables',
    email: credentials.team.email,
    password: credentials.team.password,
  },
};

export default function Page() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [selectedRole, setSelectedRole] = useState<Role>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Redirect if already authenticated
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoutes: Record<Role, string> = {
        admin: '/admin',
        customer: '/customer/customer-profile',
        team: '/team-dashboard',
      };

      router.push(dashboardRoutes[user.role]);
    }
  }, [isAuthenticated, user, router]);

  /**
   * Autofill demo credentials when role changes
   */
  useEffect(() => {
    setEmail(roleInfo[selectedRole].email);
    setPassword(roleInfo[selectedRole].password);
  }, [selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated loading
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = login(email, password);

    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    } else {
      toast({
        title: 'Login Failed',
        description: result.error,
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE (DESKTOP) */}
      <div className="hidden lg:flex lg:w-1/2 bg-maroon relative overflow-hidden">
        <div className="absolute inset-0 mandala-pattern opacity-20" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1200)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-maroon/90 to-maroon-dark/90" />

        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center border-2 border-gold mb-4">
              <span className="font-heading text-3xl font-bold text-gold">R</span>
            </div>
            <h1 className="font-heading text-4xl font-bold mb-2">
              Royal Weddings
            </h1>
            <p className="text-gold tracking-widest text-sm">STUDIO</p>
          </div>

          <h2 className="font-heading text-3xl font-bold mb-4">
            Welcome to Your Dashboard
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Manage your bookings, view your portfolio, and connect with our team
            all in one place.
          </p>

          <div className="mt-12 p-6 bg-gold/10 rounded-xl border border-gold/20">
            <h3 className="font-semibold text-gold mb-3">
              Demo Credentials
            </h3>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Select a role to auto-fill demo credentials:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gold">Admin:</span>{' '}
                admin@royalweddings.com
              </p>
              <p>
                <span className="text-gold">Customer:</span> priya@email.com
              </p>
              <p>
                <span className="text-gold">Team:</span> arjun@royalweddings.com
              </p>
              <p className="text-primary-foreground/50 mt-2">
                Password: [role]123
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (LOGIN FORM) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-elegant">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="font-heading text-2xl font-bold text-primary-foreground">
                R
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Royal Weddings
            </h1>
          </div>

          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Sign In
          </h2>
          <p className="text-muted-foreground mb-8">
            Select your role and enter credentials to continue
          </p>

          {/* ROLE SELECTION */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {(Object.keys(roleInfo) as Role[]).map((role) => {
              const info = roleInfo[role];
              const Icon = info.icon;

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    selectedRole === role
                      ? 'border-gold bg-gold/10 shadow-gold'
                      : 'border-border bg-card hover:border-gold/50'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mx-auto mb-2 ${
                      selectedRole === role
                        ? 'text-gold'
                        : 'text-muted-foreground'
                    }`}
                  />
                  <p
                    className={`text-sm font-medium ${
                      selectedRole === role
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {info.title}
                  </p>
                </button>
              );
            })}
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-background"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="royal"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                `Sign In as ${roleInfo[selectedRole].title}`
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            This is a demo application. Use the provided credentials to explore
            different dashboards.
          </p>
        </div>
      </div>
    </div>
  );
}
