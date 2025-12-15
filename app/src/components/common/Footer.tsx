import Link from 'next/link';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-maroon text-primary-foreground">
      {/* Decorative Border */}
      <div className="h-2 bg-gradient-to-r from-gold via-gold-light to-gold" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center border-2 border-gold">
                <span className="font-heading text-2xl font-bold text-gold">R</span>
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold">Royal Weddings</h3>
                <p className="text-xs text-gold tracking-widest">STUDIO</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              Capturing the essence of Indian weddings with elegance, tradition, and timeless artistry since 2010.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center hover:bg-gold/40 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center hover:bg-gold/40 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center hover:bg-gold/40 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6 text-gold">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Packages', 'Gallery', 'Team', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                    className="text-primary-foreground/80 hover:text-gold transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6 text-gold">Our Services</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li>Wedding Photography</li>
              <li>Cinematic Films</li>
              <li>Pre-Wedding Shoots</li>
              <li>Drone Coverage</li>
              <li>Photo Albums</li>
              <li>Same Day Edits</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6 text-gold">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold mt-0.5" />
                <span className="text-sm text-primary-foreground/80">
                  42, Royal Plaza, MG Road<br />
                  New Delhi - 110001, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold" />
                <span className="text-sm text-primary-foreground/80">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold" />
                <span className="text-sm text-primary-foreground/80">info@royalweddings.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gold/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © 2024 Royal Weddings Studio. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-primary-foreground/60">
              <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

