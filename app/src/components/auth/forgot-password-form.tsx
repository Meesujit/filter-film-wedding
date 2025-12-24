'use client';

import { useState } from 'react';
import { useAuth } from '@/app/lib/firebase/auth-context';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      console.error('Reset password error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later');
      } else {
        setError(err.message || 'Failed to send reset email');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-sm shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-popover-foreground">Reset Password</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Reset link sent!</p>
                <p className="text-sm mt-1">
                  Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                </p>
              </div>
            </div>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                Email Address
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

            <div className="flex justify-end w-full">
              <Button
                type="submit"
                disabled={loading}
                variant="royal"
                size="lg"
                className="w-full md:1/3 sm:1/4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <Button
            onClick={() => {
              setSuccess(false);
              setError('');
            }}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Send Another Link
          </Button>
        )}

        <div className="flex justify-center items-center gap-4 text-sm mt-5">
          <Link href="/signin" className="text-muted-foreground hover:text-popover-foreground font-medium transition-colors">
            Back to Sign In
          </Link>
          <span className="text-border">|</span>
          <Link href="/signup" className="text-muted-foreground hover:text-popover-foreground font-medium transition-colors">
            Create Account
          </Link>
        </div>

        <div className="mt-6 p-4 bg-muted/50 border border-border rounded-md">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-popover-foreground">Note:</strong> The reset link will expire in 1 hour. If you don't receive the email, check your spam folder or try again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}