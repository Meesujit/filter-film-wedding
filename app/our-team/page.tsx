'use client';

import { Instagram } from 'lucide-react';
import { useData } from '../src/context/DataContext';
import SectionHeader from '../src/components/common/SectionHeader';

export default function Page() {
  const { team } = useData();

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 bg-maroon overflow-hidden">
        <div className="absolute inset-0 mandala-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader
            title="Meet Our Team"
            subtitle="Passionate artists dedicated to capturing your perfect moments."
            light
          />
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-gradient-elegant">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={member.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-card card-hover animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  
                  {/* Experience Badge */}
                  <div className="absolute top-4 right-4 bg-gold text-maroon-dark px-3 py-1 rounded-full text-sm font-semibold">
                    {member.experience}
                  </div>
                </div>
                
                <div className="p-6 -mt-20 relative">
                  <div className="bg-card rounded-xl p-6 shadow-card">
                    <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-gold font-medium mb-2">{member.role}</p>
                    <p className="text-muted-foreground text-sm mb-4">
                      {member.specialization}
                    </p>
                    <p className="text-foreground text-sm leading-relaxed mb-4">
                      {member.bio}
                    </p>
                    
                    {member.instagram && (
                      <a
                        href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                        {member.instagram}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-16 bg-maroon">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">
              Join Our Creative Family
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              We're always looking for talented photographers, videographers, and editors 
              who share our passion for capturing beautiful moments.
            </p>
            <a href="mailto:careers@royalweddings.com">
              <button className="px-8 py-3 bg-gold text-maroon-dark font-semibold rounded-lg hover:bg-gold-dark transition-colors">
                View Open Positions
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

