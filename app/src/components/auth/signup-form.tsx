'use client';

import { useState } from 'react';
import { useAuth } from '@/app/lib/firebase/auth-context';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';

interface SignUpFormProps {
  callbackUrl?: string;
}

function getDashboardByRole(role: string): string {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'team': return '/team/dashboard';
    case 'customer': return '/customer/dashboard';
    default: return '/customer/dashboard';
  }
}

export default function SignUpForm({ callbackUrl }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail(formData.email, formData.password, formData.name);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const { user } = await response.json();
        const redirectUrl = callbackUrl || getDashboardByRole(user?.role || 'customer');
        window.location.href = redirectUrl;
      } else {
        window.location.href = callbackUrl || '/customer/dashboard';
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please sign in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/password sign up is not enabled');
      } else {
        setError(err.message || 'Failed to create account');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const { user } = await response.json();
        const redirectUrl = callbackUrl || getDashboardByRole(user?.role || 'customer');
        window.location.href = redirectUrl;
      } else {
        window.location.href = callbackUrl || '/customer/dashboard';
      }
    } catch (err: any) {
      console.error('Google sign up error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign up cancelled');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups for this site');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email using a different sign-in method');
      } else {
        setError(err.message || 'Failed to sign up with Google');
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-sm shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-popover-foreground">Create Account</h2>
          <p className="text-sm text-muted-foreground">Sign up to get started with Filter Film Studio.</p>
        </div>

        {error && (
          <div className="mb-4 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-muted-foreground rounded-md shadow-sm focus:ring-2 focus:ring-popover focus:border-popover focus:outline-none text-sm"
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-muted-foreground rounded-md shadow-sm focus:ring-2 focus:ring-popover focus:border-popover focus:outline-none text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-muted-foreground rounded-md shadow-sm focus:ring-2 focus:ring-popover focus:border-popover focus:outline-none text-sm"
              placeholder="At least 6 characters"
            />
            <p className="mt-1 text-xs text-muted-foreground">Must be at least 6 characters</p>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground mb-1">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-muted-foreground rounded-md shadow-sm focus:ring-2 focus:ring-popover focus:border-popover focus:outline-none text-sm"
              placeholder="Re-enter password"
            />
          </div>

          <div className="flex justify-end w-full">
            <Button
              onClick={handleEmailSignUp}
              disabled={loading}
              variant="royal"
              size="lg"
              className='w-full md:1/3 sm:1/4'
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </div>
        </div>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-muted-foreground bg-card hover:bg-popover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-popover/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing up...' : 'Sign up with Google'}
        </button>

        <div className="text-center text-sm mt-5">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/signin" className="text-muted-foreground hover:text-muted-foreground font-medium">
            Sign in
          </Link>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-muted-foreground hover:text-muted-foreground">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-muted-foreground hover:text-muted-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}