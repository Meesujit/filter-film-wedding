'use client'

import { useState, useEffect } from 'react';
import { X, Play, Filter, Loader2 } from 'lucide-react';
import SectionHeader from '@/app/src/components/common/SectionHeader';
import { Button } from '@/app/src/components/ui/button';
import { Gallery } from '@/app/types/gallery';
import Image from 'next/image';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch galleries and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch galleries
        const galleriesRes = await fetch('/api/admin/gallery/public');
        if (!galleriesRes.ok) throw new Error('Failed to fetch galleries');
        const galleriesData = await galleriesRes.json();
        setGalleries(galleriesData.galleries || []);

        // Fetch categories
        const categoriesRes = await fetch('/api/admin/gallery/categories');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();
        setCategories(['All', ...(categoriesData.categories || [])]);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredGallery = activeCategory === 'All'
    ? galleries
    : galleries.filter(item => item.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative py-12 overflow-hidden" id='gallery'>
        <div className="absolute inset-0 mandala-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader
            title="Our Portfolio"
            subtitle="A curated collection of moments we've had the honor to capture."
            centered
          />
        </div>
      </section>

      {/* Filter */}
      <section className="py-1 border-b border-border sticky top-20 z-30 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                size="default"
                onClick={() => setActiveCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground text-lg">Loading gallery...</p>
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && !loading && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center py-20">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-destructive text-lg font-medium mb-2">Error Loading Gallery</p>
                <p className="text-destructive/80 text-sm">{error}</p>
                <Button
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery - Masonry Grid */}
      {!loading && !error && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            {filteredGallery.length > 0 ? (
              <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {filteredGallery.map((item, index) => (
                  <div
                    key={item.id}
                    className="break-inside-avoid mb-4 group relative overflow-hidden rounded-lg cursor-pointer animate-fade-in shadow-md hover:shadow-xl transition-shadow"
                    style={{ animationDelay: `${(index % 12) * 50}ms` }}
                    onClick={() => item.type === 'photo' && setSelectedImage(item.url)}
                  >
                    <div className="relative">
                      <Image
                        src={
                          item.type === 'video'
                            ? item.thumbnail ?? '/images/video-placeholder.jpg'
                            : item.url ?? '/images/image-placeholder.jpg'
                        }
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <Play className="w-6 h-6 text-maroon-dark fill-current ml-1" />
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-maroon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-primary-foreground font-heading text-base font-semibold mb-1">{item.title}</p>
                          <p className="text-gold text-xs">{item.category} • {item.eventType}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-muted/50 rounded-lg p-12 max-w-md mx-auto">
                  <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg font-medium mb-2">
                    No items found
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Try selecting a different category
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gold transition-colors z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Gallery preview"
              fill
              className="object-contain rounded-lg animate-scale-in"
            />
          </div>
        </div>
      )}
    </>
  );
}