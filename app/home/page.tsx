'use client';
import Link from 'next/link';
import { useData } from '../src/context/DataContext';
import SectionHeader from '../src/components/common/SectionHeader';
import { Button } from '../src/components/ui/button';
import { ArrowRight, Camera, Film, Heart, Star, Award } from 'lucide-react';
import { formatPrice } from '../data/mockData';


export default function Page() {
  const { packages, gallery, team } = useData();
  const featuredPackages = packages.slice(0, 3);
  const featuredGallery = gallery.filter(g => g.type === 'photo').slice(0, 6);

  const stats = [
    { icon: Camera, value: '500+', label: 'Weddings Captured' },
    { icon: Film, value: '1000+', label: 'Films Created' },
    { icon: Heart, value: '99%', label: 'Happy Couples' },
    { icon: Award, value: '15+', label: 'Awards Won' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-maroon overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 mandala-pattern opacity-30" />
        
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1920)' }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-maroon/80 via-maroon/60 to-maroon" />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-gold/20 rounded-full animate-spin-slow" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border border-gold/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="animate-fade-in">
            {/* Decorative Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/30 mb-8">
              <Star className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold tracking-wider">Premium Wedding Studio</span>
            </div>

            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-primary-foreground mb-6 leading-tight">
              Capturing Your
              <span className="block text-gold">Royal Love Story</span>
            </h1>

            <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto mb-10 leading-relaxed">
              India's premier wedding photography & cinematography studio, 
              crafting timeless memories for over a decade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-gold/50 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gold rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-ivory-dark border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-4">
                  <stat.icon className="w-8 h-8 text-gold" />
                </div>
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative animate-fade-in">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-gold rounded-lg" />
              <img
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800"
                alt="Wedding couple"
                className="relative rounded-lg shadow-elegant w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-gold p-6 rounded-lg shadow-gold">
                <p className="font-heading text-3xl font-bold text-maroon-dark">14+</p>
                <p className="text-sm text-maroon-dark/80">Years of Excellence</p>
              </div>
            </div>
            
            <div className="animate-fade-in delay-200">
              <SectionHeader
                title="Where Tradition Meets Artistry"
                subtitle="We don't just capture moments; we weave stories that transcend time."
                centered={false}
              />
              <p className="text-muted-foreground mt-6 leading-relaxed">
                At Royal Weddings Studio, we understand that every Indian wedding is a tapestry of 
                emotions, traditions, and celebrations. Our team of passionate artists brings together 
                years of experience in capturing the essence of your special day with elegance and authenticity.
              </p>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                From the sacred rituals to the joyous celebrations, we ensure every precious moment 
                is preserved for generations to come.
              </p>
              <Link href="/about" className="inline-block mt-8">
                <Button variant="outline" className="group">
                  Discover Our Story
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Preview */}
      <section className="py-20 md:py-28 bg-gradient-elegant">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Wedding Packages"
            subtitle="Tailored experiences for every celebration, from intimate ceremonies to grand festivities."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {featuredPackages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="group relative bg-card rounded-xl overflow-hidden shadow-card card-hover animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gold text-maroon-dark text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.preview}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {pkg.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-heading text-2xl font-bold text-primary">
                      {formatPrice(pkg.price)}
                    </p>
                    <Link href="/packages">
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/packages">
              <Button variant="royal" size="lg" className="group">
                View All Packages
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Portfolio"
            subtitle="A glimpse into the magical moments we've had the honor to capture."
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-16">
            {featuredGallery.map((item, index) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-lg animate-fade-in ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                    index === 0 ? 'h-[500px]' : 'h-64'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-primary-foreground font-heading text-lg">{item.title}</p>
                    <p className="text-gold text-sm">{item.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/gallery">
              <Button variant="outline" size="lg" className="group">
                Explore Full Gallery
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-20 md:py-28 bg-maroon">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Meet Our Artists"
            subtitle="Passionate professionals dedicated to capturing your perfect moments."
            light
          />

          <div className="flex flex-wrap justify-center gap-8 mt-16">
            {team.slice(0, 4).map((member, index) => (
              <div
                key={member.id}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-gold animate-spin-slow" />
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover border-4 border-gold/30"
                  />
                </div>
                <h3 className="font-heading text-lg font-semibold text-primary-foreground">
                  {member.name}
                </h3>
                <p className="text-gold text-sm">{member.role}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/team">
              <Button variant="elegant" size="lg" className="group">
                Meet Full Team
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-elegant">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Create Your
              <span className="text-primary block">Timeless Memories?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Let's discuss how we can capture the magic of your special day. 
              Contact us today for a personalized consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
                <Button variant="royal" size="xl" className="group">
                  Book Consultation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="xl">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

