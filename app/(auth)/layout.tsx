import { CheckIcon } from "lucide-react";

// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col gap-5 relative overflow-hidden">        
        <div className="relative z-10">          
          <div className="space-y-6 mb-12">
            <h2 className="text-4xl font-bold text-popover leading-tight">
              Bring Your Vision<br />to Life
            </h2>
            <p className="text-popover text-lg leading-relaxed">
              Join our platform to access premium film production services, manage your projects, and collaborate with industry professionals.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          {[
            'Professional team management',
            'Real-time project tracking',
            'Secure booking system'
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-popover">
              <div className="w-10 h-10 bg-card bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckIcon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-card">
        <div className="w-full max-w-md">
          {/* This is where child pages render */}
          {children}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Filter Film Studio. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <a href="#" className="hover:text-popover-foreground transition">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-popover-foreground transition">Terms</a>
              <span>•</span>
              <a href="#" className="hover:text-popover-foreground transition">Help</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}