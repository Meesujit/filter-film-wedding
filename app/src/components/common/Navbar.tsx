'use client';

import { useState } from 'react';
import { Menu, X, User, Loader } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';
import { cn } from '@/app/lib/utils';
import { useAuth } from '@/app/lib/firebase/auth-context';

const navLinks = [
  { href: '/#home', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#packages', label: 'Packages' },
  { href: '/#team', label: 'Our Founder' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();

  const getDashboardLink = () => {
    if (!user?.role) return '/signin';
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'team':
        return '/team/dashboard';
      case 'customer':
        return '/customer/dashboard';
      default:
        return '/signin';
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo/filter-film-logo.svg"
              alt="Filter Film Studio Logo"
              width={150}
              height={40}
              className="w-60 h-32 object-cover"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-lg font-bold transition-colors hover:text-primary relative py-2',
                  pathname === link.href
                    ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {loading ? (
              <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
            ) : isAuthenticated ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/signin">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            )}
            <Link href="/#packages">
              <Button className="bg-gradient-royal">Explore Packages</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden flex flex-col gap-2 py-4 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'text-lg font-bold transition-colors hover:text-primary py-2 px-2 rounded-md',
                  pathname === link.href ? 'text-primary bg-muted' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-border my-2"></div>
            
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader className="animate-spin mx-auto w-6 h-6 text-muted-foreground" />
                <span className="sr-only">Loading...</span>
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-2">
                <Link href={getDashboardLink()} onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="gap-2 w-full">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/signin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm" className="gap-2 w-full">
                  <User className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            )}
            
            <Link href="/packages" onClick={() => setIsOpen(false)}>
              <Button className="bg-gradient-royal w-full">Explore Packages</Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}