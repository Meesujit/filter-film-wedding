'use client';
import Link from 'next/link';
import { Check, Clock, Camera, ArrowRight } from 'lucide-react';
import { useData } from '../../src/context/DataContext';
import SectionHeader from '../../src/components/common/SectionHeader';
import { formatPrice } from '../../data/mockData';
import { Button } from '../../src/components/ui/button';


export default function Page() {
  const { packages } = useData();

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 bg-maroon overflow-hidden">
        <div className="absolute inset-0 mandala-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader
            title="Wedding Packages"
            subtitle="Choose the perfect package to capture every precious moment of your celebration."
            light
          />
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 bg-gradient-elegant">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`group relative bg-card rounded-2xl overflow-hidden shadow-card card-hover animate-fade-in ${
                  pkg.popular ? 'ring-2 ring-gold' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gold text-maroon-dark text-center py-2 text-sm font-semibold z-10">
                    ⭐ Most Popular Choice
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                    <img
                      src={pkg.preview}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card md:from-transparent md:to-card" />
                  </div>
                  
                  <div className={`p-6 md:p-8 flex-1 ${pkg.popular ? 'pt-8' : ''}`}>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.duration}</span>
                    </div>
                    
                    <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                      {pkg.name}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4">
                      {pkg.description}
                    </p>

                    <div className="mb-6">
                      <p className="font-heading text-3xl font-bold text-primary mb-4">
                        {formatPrice(pkg.price)}
                      </p>
                      
                      <ul className="space-y-2">
                        {pkg.deliverables.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                            <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href={`/book?package=${pkg.id}`}>
                      <Button variant={pkg.popular ? 'gold' : 'outline'} className="w-full group">
                        Book This Package
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Package CTA */}
      <section className="py-16 bg-maroon">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Camera className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">
              Need Something Custom?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Every wedding is unique. Let us create a personalized package 
              that perfectly matches your vision and requirements.
            </p>
            <Link href="/contact">
              <Button variant="elegant" size="lg">
                Request Custom Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

