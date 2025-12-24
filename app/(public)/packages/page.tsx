import SectionHeader from "@/app/src/components/common/SectionHeader";
import Image from "next/image";
import Link from "next/link";

const packages = [
  {
    title: "Photo + Film Combos",
    desc:
      "A complete storytelling experience combining photography and cinematic films.",
    img: "/package-image/combo.png",
  },
  {
    title: "Pre-Wedding & Couple Shoots",
    desc:
      "Creative couple sessions celebrating your journey together.",
    img: "/package-image/prewedding.png",
  },
  {
    title: "Custom Wedding Packages",
    desc:
      "Tailored experiences designed around your wedding vision.",
    img: "/package-image/custom1.png",
  },
]

export default function PackagesSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30 relative overflow-hidden" id='packages'>
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <div className="mb-16 lg:mb-24">
          <SectionHeader
            title="Our Wedding Packages"
            subtitle="Explore our thoughtfully curated photography and cinematography packages designed to suit every kind of celebration — from intimate ceremonies to grand, multi-day weddings."
            centered
          />
        </div>

        {/* Main Featured Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Photography - Left Large Card */}
          <div className="relative group overflow-hidden rounded-[2rem] h-[600px] shadow-2xl">
            <Image
              src="/package-image/photo.png"
              alt="Photography Packages"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-10">
              <div className="backdrop-blur-md bg-card/10 rounded-2xl p-6 border border-border/20">
                <span className="inline-block px-4 py-1.5 bg-card/10 backdrop-blur-sm rounded-full text-xs font-semibold text-popover mb-4 tracking-wide">
                  PREMIUM COLLECTION
                </span>
                <h3 className="font-heading text-3xl lg:text-4xl font-bold mb-4 text-popover">
                  Photography Packages
                </h3>
                <p className="text-popover/90 leading-relaxed text-base">
                  Timeless wedding photography that captures raw emotions, traditions,
                  and candid moments with artistic storytelling.
                </p>
              </div>
            </div>
          </div>

          {/* Cinematography - Right Split */}
          <div className="flex flex-col gap-8">
            {/* Top Card */}
            <div className="relative group overflow-hidden rounded-[2rem] h-[288px] shadow-xl">
              <Image
                src="/package-image/cinematography.png"
                alt="Cinematography Packages"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent" />
              
              {/* Decorative Corner */}
              <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-border/30 rounded-tr-2xl" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="font-heading text-2xl lg:text-3xl font-bold mb-3 text-popover">
                  Cinematography Packages
                </h3>
                <p className="text-popover/90 leading-relaxed text-sm">
                  Cinematic wedding films crafted like a movie,
                  preserving emotions beyond just visuals.
                </p>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-2 gap-8 h-[296px]">
              {packages.slice(0, 2).map((pkg, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-2xl shadow-lg"
                >
                  <Image
                    src={pkg.img}
                    alt={pkg.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="font-heading text-lg font-bold mb-2 text-popover leading-tight">
                      {pkg.title}
                    </h3>
                    <p className="text-popover/80 text-xs leading-relaxed">
                      {pkg.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Featured Card */}
        <div className="relative group overflow-hidden rounded-[2rem] h-[400px] shadow-2xl">
          <Image
            src={packages[2].img}
            alt={packages[2].title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          
          {/* Decorative Lines */}
          <div className="absolute top-8 left-8 space-y-2">
            <div className="w-20 h-0.5 bg-border/60" />
            <div className="w-12 h-0.5 bg-border/40" />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="w-full lg:w-2/3 p-10 lg:p-16">
              <span className="inline-block px-4 py-1.5 bg-card/10 backdrop-blur-sm rounded-full text-xs font-semibold text-popover mb-6 tracking-wide">
                BESPOKE EXPERIENCE
              </span>
              <h3 className="font-heading text-3xl lg:text-5xl font-bold mb-5 text-popover leading-tight">
                {packages[2].title}
              </h3>
              <p className="text-popover/90 text-lg leading-relaxed max-w-2xl">
                {packages[2].desc}
              </p>
              <div className="mt-8 flex gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-6 h-6 text-popover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-popover/90 font-medium">Personalized</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-6 h-6 text-popover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-popover/90 font-medium">Flexible</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-6 h-6 text-popover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <span className="text-popover/90 font-medium">Exclusive</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-card/50 backdrop-blur-sm rounded-full border border-borde/10">
            <span className="text-sm font-medium text-muted-foreground">
              Can't find what you're looking for?
            </span>
            <Link href='/signin' className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors">
              Create Custom Package
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
