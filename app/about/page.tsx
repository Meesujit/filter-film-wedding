import { Heart, Camera, Award, Users, Sparkles, Music, Flower2 } from 'lucide-react';
import SectionHeader from '../src/components/common/SectionHeader';
import Link from 'next/link';
import { Button } from '../src/components/ui/button';


const traditions = [
  {
    icon: Sparkles,
    title: 'Mehndi Ceremony',
    description: 'The intricate art of henna, symbolizing love and prosperity. We capture every delicate detail of this beautiful ritual.',
  },
  {
    icon: Music,
    title: 'Sangeet Night',
    description: 'A night of music, dance, and celebration. Our cameras capture the joy and energy of family performances.',
  },
  {
    icon: Flower2,
    title: 'Haldi Ritual',
    description: 'The auspicious turmeric ceremony filled with laughter and blessings. We preserve these candid moments of love.',
  },
  {
    icon: Heart,
    title: 'Sacred Vows',
    description: 'The seven sacred pheras around the holy fire. We document each precious moment of your eternal bond.',
  },
];

export default function Page() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 bg-maroon overflow-hidden">
        <div className="absolute inset-0 mandala-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader
            title="Our Story"
            subtitle="Celebrating the rich tapestry of Indian weddings since 2010."
            light
          />
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-elegant">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Where Every Frame Tells a 
                <span className="text-primary block">Sacred Story</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Royal Weddings Studio was born from a deep appreciation for the grandeur 
                and emotional depth of Indian weddings. Founded in 2010 by a team of passionate 
                photographers, we set out to redefine wedding documentation in India.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We believe that every wedding is a unique celebration of love, tradition, and 
                family. Our approach combines artistic vision with cultural sensitivity, ensuring 
                that every sacred ritual and joyous moment is captured with authenticity.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Over the years, we've had the privilege of documenting over 500 weddings across 
                India, from intimate ceremonies in Delhi to grand celebrations in Udaipur's palaces.
              </p>
            </div>
            
            <div className="relative animate-fade-in delay-200">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400"
                  alt="Wedding ceremony"
                  className="rounded-lg shadow-card h-48 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400"
                  alt="Mehndi ceremony"
                  className="rounded-lg shadow-card h-48 object-cover mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400"
                  alt="Couple portrait"
                  className="rounded-lg shadow-card h-48 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400"
                  alt="Pre-wedding shoot"
                  className="rounded-lg shadow-card h-48 object-cover mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Indian Wedding Traditions */}
      <section className="py-20 bg-maroon">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Celebrating Indian Traditions"
            subtitle="We understand and respect the significance of each ritual in an Indian wedding."
            light
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {traditions.map((tradition, index) => (
              <div
                key={tradition.title}
                className="text-center bg-maroon-light/30 rounded-2xl p-8 border border-gold/20 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-6">
                  <tradition.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-primary-foreground mb-3">
                  {tradition.title}
                </h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">
                  {tradition.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-elegant">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Values"
            subtitle="The principles that guide our craft and relationships."
          />

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: Heart,
                title: 'Passion',
                description: 'We pour our hearts into every project, treating each wedding as if it were our own.',
              },
              {
                icon: Camera,
                title: 'Excellence',
                description: 'We never compromise on quality, using the best equipment and techniques available.',
              },
              {
                icon: Users,
                title: 'Connection',
                description: 'We build relationships with our couples, becoming part of their extended family.',
              },
            ].map((value, index) => (
              <div
                key={value.title}
                className="text-center bg-card rounded-2xl p-8 shadow-card card-hover animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                  <value.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-16 bg-ivory-dark border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-12">
            {['WeddingSutra Award 2023', 'Best Cinematography 2022', 'WPAI Excellence Award', 'Canvera Top Studio'].map((award) => (
              <div key={award} className="flex items-center gap-3 text-muted-foreground">
                <Award className="w-6 h-6 text-gold" />
                <span className="font-medium">{award}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-elegant">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Let's Create Magic Together
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Ready to begin your journey with us? We'd love to hear about your wedding plans.
            </p>
            <Link href="/contact">
              <Button variant="royal" size="lg">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
