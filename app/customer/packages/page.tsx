'use client';

import { useToast } from "@/app/hooks/use-toast";
import { Package } from "@/app/types/package";
import { Loader2, Check, X, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/app/src/components/ui/button";

export default function CustomerPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [fetchingPackages, setFetchingPackages] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/package');
      const data = await response.json();

      if (response.ok) {
        setPackages(Array.isArray(data.packages) ? data.packages : []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load packages',
        variant: 'destructive',
      });
    } finally {
      setFetchingPackages(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <section className="space-y-8 animate-fade-in">
      <div className="space-y-3">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Wedding Packages
        </h1>
        <p className="text-muted-foreground">
          Click on any package to view full details
        </p>
      </div>

      {fetchingPackages ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ): packages.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No packages available at the moment.
        </p>
      ) : (
        <>
          {/* Package Grid - Small Cards */}
          {!selectedPackage && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all group"
                >
                  {/* Image */}
                  <div className="relative h-32">
                    <Image
                      src={pkg.preview}
                      alt={pkg.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    {pkg.popular && (
                      <span className="absolute top-2 right-2 bg-gold text-maroon-dark text-[10px] font-semibold px-2 py-0.5 rounded">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 space-y-1.5">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1 text-left">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-muted-foreground text-left">
                      {pkg.duration}
                    </p>
                    <div className="text-base font-bold text-gold text-left">
                      {formatPrice(pkg.price)}
                    </div>
                    <div className="flex items-center justify-end text-primary text-xs font-medium pt-1">
                      View Details
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Package Details View */}
          {selectedPackage && (
            <div className="space-y-6 animate-fade-in">
              {/* Back Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPackage(null)}
                className="mb-4"
              >
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Packages
              </Button>

              {/* Details Card */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative h-96 md:h-auto">
                    <Image
                      src={selectedPackage.preview}
                      alt={selectedPackage.name}
                      fill
                      className="object-cover"
                    />
                    {selectedPackage.popular && (
                      <span className="absolute top-4 left-4 bg-gold text-maroon-dark text-xs font-semibold px-3 py-1.5 rounded">
                        Popular Choice
                      </span>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-8 space-y-6">
                    <div>
                      <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                        {selectedPackage.name}
                      </h2>
                      <p className="text-muted-foreground">
                        {selectedPackage.duration}
                      </p>
                    </div>

                    <div className="text-4xl font-bold text-gold">
                      {formatPrice(selectedPackage.price)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">About This Package</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedPackage.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-3">What's Included</h3>
                      <div className="space-y-2.5">
                        {selectedPackage.deliverables.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button variant="royal" size="lg" className="flex-1">
                        Book Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => setSelectedPackage(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}