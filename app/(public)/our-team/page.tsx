'use client';

import SectionHeader from '@/app/src/components/common/SectionHeader';
import { Instagram, Quote } from 'lucide-react';
import Image from 'next/image';

export default function OurTeam() {
  // Founder data
  const founder = {
    id: 1,
    name: "Subham Dalai",
    role: "Founder & Cinematographer",
    specialization: "Cinematic Wedding Filmmaker",
    experience: "7+ Years",
    bio: "With over 7 years of experience in the film industry, Subham founded Filter Film Studio with a vision to revolutionize wedding cinematography in India. His unique storytelling approach blends traditional Indian aesthetics with contemporary filmmaking techniques, creating timeless visual narratives that capture the essence of every celebration.",
    photo: "/team-image/founder1.png",
    instagram: "@subhamdalai__/",
    studio: "Filter Film Studio",
    studio_instagram: "@filterfilm.studio",
  };

  return (
    <section className="py-20 bg-gradient-elegant" id='team'>
      <div className="container mx-auto px-2">
        <div className="mb-16 lg:mb-12">
          <SectionHeader
            title="Meet Our Founder"
            subtitle="Discover the visionary behind Filter Film Studio, Subham Dalai. With over 7 years of experience in cinematic wedding filmmaking."
            centered
          />
        </div>
        <div className="max-w-6xl mx-auto">
          {/* Founder Profile */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative">
              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-card">
                <Image
                  src={founder.photo}
                  alt={founder.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div>
              <div className="inline-block bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Founder & Visionary
              </div>
              <h2 className="font-bold text-4xl text-foreground mb-3">
                {founder.name}
              </h2>
              <p className="text-gold text-xl font-bold mb-6">{founder.role}</p>
              <p className="text-muted-foreground text-lg mb-6 font-bold">
                {founder.specialization}
              </p>
              <p className="text-foreground text-lg font-bold leading-relaxed mb-6">
                {founder.bio}
              </p>
              <div className="mb-6 flex flex-wrap gap-4">

                {founder.instagram && (
                  <a
                    href={`https://instagram.com/${founder.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors group"
                  >
                    <div className="p-2 bg-gold/10 rounded-full group-hover:bg-gold/20 transition-colors flex flex-row items-center gap-2">
                      <Instagram className="w-5 h-5" />
                      <span className="font-medium">{founder.instagram}</span>
                    </div>
                  </a>
                )}
                {founder.instagram && (
                  <a
                    href={`https://instagram.com/${founder.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors group"
                  >
                    <div className="p-2 bg-gold/10 rounded-full group-hover:bg-gold/20 transition-colors flex flex-row items-center gap-2">
                      <Instagram className="w-5 h-5" />
                      <span className="font-medium">{founder.studio_instagram}</span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}