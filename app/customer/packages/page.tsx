'use client';

import { useToast } from "@/app/hooks/use-toast";
import { Package } from "@/app/types/package";
import { Loader2, Check } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/app/src/components/ui/button";

export default function CustomerPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [fetchingPackages, setFetchingPackages] = useState(true);
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

  if (fetchingPackages) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <section className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Our Packages
        </h1>
        <p className="text-muted-foreground mt-2">
          Browse and select from our range of packages tailored for your needs.
        </p>
      </div>

      {packages.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No packages available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48">
                <Image
                  src={pkg.preview}
                  alt={pkg.name}
                  fill
                  className="object-cover"
                />
                {pkg.popular && (
                  <span className="absolute top-3 right-3 bg-gold text-maroon-dark text-xs font-semibold px-3 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-heading text-xl font-semibold">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {pkg.duration}
                  </p>
                </div>

                <p className="text-gold text-2xl font-bold">
                  {formatPrice(pkg.price)}
                </p>

                <p className="text-sm text-muted-foreground">
                  {pkg.description}
                </p>

                <ul className="space-y-2">
                  {pkg.deliverables.slice(0, 4).map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="royal" className="w-full mt-4">
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
