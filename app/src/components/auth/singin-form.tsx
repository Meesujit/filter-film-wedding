'use client';

import { useState } from 'react';
import { useAuth } from '@/app/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';


interface SignInFormProps {
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

export default function SignInForm({ callbackUrl }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmail(email, password);

      // Wait a bit for the auth context to update
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get the session to retrieve user role
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const { user } = await response.json();
        const redirectUrl = callbackUrl || getDashboardByRole(user?.role || 'customer');
        window.location.href = redirectUrl;
      } else {
        // Fallback to customer dashboard if session check fails
        window.location.href = callbackUrl || '/customer/dashboard';
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later');
      } else {
        setError(err.message || 'Failed to sign in');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
      console.error('Google sign in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in cancelled');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups for this site');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-sm shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-popover-foreground">Sign In</h2>
          <p className="text-sm text-muted-foreground">Welcome back! Please sign in to continue.</p>
        </div>

        {error && (
          <div className="mb-4 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-muted-foreground rounded-md shadow-sm focus:ring-2 focus:ring-popover focus:border-popover focus:outline-none text-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end w-full">
            <Button
              onClick={handleEmailSignIn}
              disabled={loading}
              variant="royal"
              size="lg"
              className='w-full md:1/3 sm:1/4'
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
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
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-muted-foreground bg-card hover:bg-popover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-popover/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <div className="flex justify-between items-center text-sm mt-5">
          <Link href="/forgot-password" className="text-muted-foreground hover:text-muted-foreground font-medium">
            Forgot password?
          </Link>
          <Link href="/signup" className="text-muted-foreground hover:text-muted-foreground font-medium">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}