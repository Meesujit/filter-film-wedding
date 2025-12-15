'use client'
import { useState } from 'react';
import { X, Play, Filter } from 'lucide-react';
import { useData } from '@/app/src/context/DataContext';
import SectionHeader from '@/app/src/components/common/SectionHeader';
import { Button } from '@/app/src/components/ui/button';



const categories = ['All', 'Ceremony', 'Bridal', 'Portraits', 'Mehndi', 'Sangeet', 'Reception', 'Decor', 'Films'];

export default function Page() {
  const { gallery } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredGallery = activeCategory === 'All' 
    ? gallery 
    : gallery.filter(item => item.category === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 bg-maroon overflow-hidden">
        <div className="absolute inset-0 mandala-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader
            title="Our Portfolio"
            subtitle="A curated collection of moments we've had the honor to capture."
            light
          />
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-ivory-dark border-b border-border sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gradient-elegant">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGallery.map((item, index) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-lg cursor-pointer animate-fade-in ${
                  index % 5 === 0 ? 'col-span-2 row-span-2' : ''
                }`}
                style={{ animationDelay: `${(index % 8) * 50}ms` }}
                onClick={() => item.type === 'photo' && setSelectedImage(item.url)}
              >
                <img
                  src={item.type === 'video' ? item.thumbnail : item.url}
                  alt={item.title}
                  className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                    index % 5 === 0 ? 'h-[400px] md:h-[500px]' : 'h-48 md:h-64'
                  }`}
                />
                
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-maroon-dark fill-current ml-1" />
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-primary-foreground font-heading text-lg">{item.title}</p>
                    <p className="text-gold text-sm">{item.category} • {item.eventType}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredGallery.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-background hover:text-gold transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Gallery preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg animate-scale-in"
          />
        </div>
      )}
    </div>
  );
};

