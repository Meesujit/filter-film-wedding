import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/app/src/components/ui/button';

export default function Home() {
  return (
    <div className="overflow-hidden" id='home'>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 mandala-pattern opacity-30" />
        
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: 'url(/hero-image/hero-image.jpg)' }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-maroon/50 via-maroon/50 to-maroon" />

        {/* Decorative Elements */}
        {/* <div className="absolute top-20 left-10 w-32 h-32 border border-gold/20 rounded-full animate-spin-slow" /> */}
        <div className="absolute bottom-20 right-10 w-48 h-48 border border-gold/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="animate-fade-in">
            {/* Decorative Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/60 border border-gold/30 mb-8">
              <Star className="w-4 h-4 text-ivory" />
              <span className="text-lg font-bold text-ivory tracking-wider">Premium Wedding Studio</span>
            </div>

            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-primary-foreground mb-6 leading-tight">
              Capturing Your
              <span className="block text-gold">Royal Love Story</span>
            </h1>

            <p className="text-xl md:text-2xl font-semibold text-primary-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              India's premier wedding photography & cinematography studio, 
              crafting timeless memories for over a decade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signin">
                <Button variant="gold" size="xl" className="group">
                  Book Your Date
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/gallery">
                <Button variant="elegant" size="xl">
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

