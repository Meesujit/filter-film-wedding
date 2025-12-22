import SectionHeader from "@/app/src/components/common/SectionHeader";
import { Button } from "@/app/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="py-9">
      <div className="container mx-auto px-4 flex flex-col gap-10">
        <SectionHeader 
          title="About Filter Film Studio" 
          subtitle="Discover the story behind Filter Film Studio, where passion meets professionalism in capturing your most cherished moments."
          centered
        />

        <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative animate-fade-in">
              <div className="absolute -top-4 -left-4 w-full h-full rounded-lg" />
              <Image
                src="/about-image/about-image.jpg"
                alt="Wedding couple"
                width={600}
                height={500}
                className="relative rounded-lg shadow-elegant w-full h-[500px] object-cover"
              />
            </div>
            
            <div className="animate-fade-in delay-200">
              <p className="text-muted-foreground leading-relaxed font-bold text-xl">
                At <span className="text-2xl font-bold text-gold">Filter Film Studio</span>, we understand that every Indian wedding is a tapestry of 
                emotions, traditions, and celebrations. Our team of passionate artists brings together 
                years of experience in capturing the essence of your special day with elegance and authenticity.
              </p>
              <p className="text-muted-foreground mt-4 leading-relaxed font-bold text-xl">
                From the sacred rituals to the joyous celebrations, we ensure every precious moment 
                is preserved for generations to come.
              </p>
              <Link href="/signin" className="inline-block mt-8">
                <Button variant="outline" className="group font-bold text-xl" size="lg">
                  Discover More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      
    </section>
  )
}